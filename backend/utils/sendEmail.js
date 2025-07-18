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

const sendResetPasswordEmail = async (email, name, token) => {
  const link = `http://localhost:5173/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Hi ${name},</p>
           <p>You requested to reset your password. Click below:</p>
           <a href="${link}">${link}</a>
           <p>This link will expire in 30 minutes.</p>`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
