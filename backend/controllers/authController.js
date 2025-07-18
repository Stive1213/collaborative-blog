const db = require('../db/knex');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const {
  sendVerificationEmail,
  sendResetPasswordEmail
} = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    await db('users').insert({
      name,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: token,
      role: 'user',
    });

    await sendVerificationEmail(email, name, token);

    res.status(200).json({ message: 'Registration successful! Please check your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await db('users').where({ verification_token: token }).first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    await db('users')
      .where({ id: user.id })
      .update({
        is_verified: true,
        verification_token: null,
      });

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Google Sign-In
const loginWithGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await db('users').where({ email }).first();

    if (!user) {
      // Create new user with verified email and google_id
      const defaultRole = 'user';
      const hashedPassword = ''; // No password for Google sign-in users

      const [newUserId] = await db('users').insert({
        name,
        email,
        password: hashedPassword,
        is_verified: true,
        google_id: googleId,
        role: defaultRole,
        verification_token: null,
      });

      user = await db('users').where({ id: newUserId }).first();
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Google sign-in successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google sign-in error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

    await db('users')
      .where({ id: user.id })
      .update({ reset_token: token, reset_token_expiry: expiry });

    await sendResetPasswordEmail(email, user.name, token);

    res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await db('users')
      .where({ reset_token: token })
      .andWhere('reset_token_expiry', '>', new Date())
      .first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db('users')
      .where({ id: user.id })
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      });

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
};
