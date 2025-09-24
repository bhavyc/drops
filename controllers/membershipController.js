const User = require("../models/User");

// Buy membership
exports.buyMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("User not found");

    // Set membership active for 30 days
    user.isMember = true;
    user.membershipExpiry = new Date(Date.now() + 30*24*60*60*1000);
    await user.save();

    // Redirect back to profile
    res.redirect("/api/auth/profile");
  } catch (err) {
    console.error("Membership buy error:", err);
    res.status(500).send("Something went wrong. Try again.");
  }
};
