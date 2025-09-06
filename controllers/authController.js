const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Claim = require("../models/Claim");
const Drop = require("../models/FruitDrop");
const JWT_SECRET = process.env.JWT_SECRET || "token";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Render register page
exports.showRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

// Handle register form
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.render("auth/register", { error: "Email already exists" });

    user = new User({ name, email, password });
    await user.save();
    res.redirect("login");
  } catch (err) {
    res.render("auth/register", { error: err.message });
  }
};

// Render login page
exports.showLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

// Handle login form
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render("auth/login", { error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.render("auth/login", { error: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("profile");
  } catch (err) {
    res.render("auth/login", { error: err.message });
  }
};

// Render profile page (protected)
exports.getProfile = async (req, res) => {
  try {
    // Get all claims by this user and populate drop details
    const claims = await Claim.find({ user: req.user._id })
                              .populate("drop")  // get full drop info
                              .sort({ claimedAt: -1 }); // latest first

    res.render("auth/profile", { 
      user: req.user,
      claimedDrops: claims 
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.send("Error loading profile: " + err.message);
  }
};