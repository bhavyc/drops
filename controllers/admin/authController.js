const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "token";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name : user.name },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

//  ADMIN LOGIN  

// Render admin login page
exports.showLogin = (req, res) => {
  res.render("admin/login", { error: null });
};

 
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.render("admin/login", { error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.render("admin/login", { error: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("adminToken", token, { httpOnly: true });
    res.redirect("/api/admin/dashboard");
  } catch (err) {
    res.render("admin/login", { error: err.message });
  }
};

//   ADMIN PROTECT MIDDLEWARE  
exports.protect = (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return res.redirect("/api/admin/login");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") return res.redirect("/api/admin/login");

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.redirect("/api/admin/login");
  }
};



//   ADMIN DASHBOARD  
exports.dashboard = async (req, res) => {
  try {
    res.render("admin/dashboard", { user: req.user });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.send("Error loading dashboard");
  }
};



//   ADMIN REGISTRATION  
exports.showRegister = (req, res) => {
  res.render("admin/register", { error: null });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: "admin" });

    // If admins exist, require current user to be logged-in admin
    if (existingAdmin) {
      if (!req.user || req.user.role !== "admin") {
        return res.send("Unauthorized");
      }
    }

    // Check if email is already taken
    let user = await User.findOne({ email });
    if (user) return res.render("admin/register", { error: "Email already exists" });

    // Create new admin
    user = new User({ name, email, password, role: "admin", isMember: true });
    await user.save();

    // Redirect to admin login
    res.redirect("/api/admin/login");
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.render("admin/register", { error: err.message });
  }
};

//   ADMIN LOGOUT  
exports.logout = (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/api/admin/login");
};
