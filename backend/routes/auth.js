const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/authController');

router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);

module.exports = router;
