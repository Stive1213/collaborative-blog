const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/authController');
const { loginUser} = require('../controllers/authController');

router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.ppost('/login', loginUser);
module.exports = router;
