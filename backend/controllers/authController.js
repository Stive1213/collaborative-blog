const db = require('../db/knex');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
module.exports = { registerUser };
