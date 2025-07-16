const db = require('../db/knex');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { sendVerificationEmail } = require('../utils/sendEmail');

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


const verifyEmail = async (req, res) => {
    const {token} = req.params;

    try {
        const user = await db('users').where({verification_token: token}).first();

        if (!user) {
            return res.status(400).json({message: 'invalid or expired verification token'});

        }

        await db('users')
        .where({id: user.id})
        .update({
            is_verified: true,
            verification_token: null
        });
        res.status(200).json({message: 'Email verified successfully! You can now log in.'});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error during email verification'});
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await db('users').where({email}).first();
        if (!user) {
            return res.status(400).json({message: 'user not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        if (!user.is_verified) {
            return res.status(400).json({message: 'Please verify your email before logging in'});
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error during login'});
    }
}

module.exports = { registerUser };
