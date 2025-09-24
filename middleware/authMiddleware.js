
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "token";

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/api/auth/login");

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.redirect("/api/auth/login");
  }
};

// Membership required middleware
// exports.requireMembership = (req, res, next) => {
//   if (!req.user || !req.user.isMember) {
//     return res.status(403).send("Membership required to access this feature.");
//   }
//   next();
// };


 

exports.requireMembership = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.isMember) {
      return res.status(403).send("Membership required to access this feature.");
    }

    // Expiry check
    if (user.membershipExpiry && user.membershipExpiry < new Date()) {
      user.isMember = false;
      await user.save();
      return res.status(403).send("Your membership has expired. Please renew.");
    }

    // Attach fresh user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Membership middleware error:", err);
    res.status(500).send("Something went wrong. Try again.");
  }
};


