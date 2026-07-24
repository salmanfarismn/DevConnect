const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../validation/validation");
const { authenticateToken } = require("../middleware/auth");

router.get("/dashboard", authenticateToken, authController.getDashboard);
router.post("/register", validateRegister, authController.registerUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", validateLogin, authController.loginUser);
router.post("/logout", authController.logoutUser);

module.exports = router;