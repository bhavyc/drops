const express = require("express");
const router = express.Router();
const {
  showRegister,
  register,
  showLogin,
  login,
  getProfile
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// View routes
router.get("/register", showRegister);
router.get("/login", showLogin);
router.get("/profile", protect, getProfile);

// Form routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
