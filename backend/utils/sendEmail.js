const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const link = `http://localhost:5000/auth/verify/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Hi ${name},</p><p>Please verify your email by clicking below:</p><a href="${link}">${link}</a>`,
  });
};

module.exports = { sendVerificationEmail };
