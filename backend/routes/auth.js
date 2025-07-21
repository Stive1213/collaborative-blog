const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google", loginWithGoogle);

module.exports = router;
