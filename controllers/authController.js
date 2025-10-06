const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Claim = require("../models/Claim");
const Drop = require("../models/FruitDrop");
const JWT_SECRET = process.env.JWT_SECRET || "token";
const Deal = require("../models/Deal");

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
console.log(user)
     if(user.role==="admin"){
     
      return res.render("auth/login", { error: "Admins must use the admin login page" });
     }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.render("auth/login", { error: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("profile");
  } catch (err) {
    res.render("auth/login", { error: err.message });
  }
};
 
exports.getProfile = async (req, res) => {
  try {
    // Claimed drops (via Claim collection)
    const claims = await Claim.find({ user: req.user._id })
                              .populate("drop")
                              .sort({ claimedAt: -1 });
    const claimedDrops = claims.filter(c => c.drop);

    // Purchased deals (via Deal collection)
    const purchasedDeals = await Deal.find({
      claimedBy: req.user._id
    }).sort({ createdAt: -1 });

    res.render("auth/profile", { 
      user: req.user,
      claimedDrops,
      purchasedDeals
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.send("Error loading profile: " + err.message);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/auth/login");
};

 