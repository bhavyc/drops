const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "token";

exports.protect = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) return res.redirect("/auth/login");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.redirect("/auth/login");
  }
};
