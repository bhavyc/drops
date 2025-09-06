const Drop = require("../models/FruitDrop");
const Claim = require("../models/Claim");
// List active drops
exports.listDrops = async (req, res) => {
  try {
    const now = new Date();
    const drops = await Drop.find({ endTime: { $gt: now } }).sort({ startTime: 1 });
    res.render("drop/drops", { drops, user: req.user });
  } catch (err) {
    res.send("Error: " + err.message);
  }
};

// Show single drop details
exports.showDrop = async (req, res) => {
  try {
    const drop = await Drop.findById(req.params.id);
    if (!drop) return res.send("Drop not found");

    // Check if this user already claimed this drop
    const alreadyClaimed = await Claim.findOne({
      user: req.user._id,
      drop: drop._id,
    });

    // Count total claims for this drop
    const totalClaims = await Claim.countDocuments({ drop: drop._id });

    res.render("drop/dropDetail", {
      drop,
      user: req.user,
      alreadyClaimed: !!alreadyClaimed,
      totalClaims,
    });
  } catch (err) {
    console.error("Error in showDrop:", err);
    res.send("Error: " + err.message);
  }
};


// Claim drop
exports.claimDrop = async (req, res) => {
  try {
    const userId = req.user._id;
    const dropId = req.params.id;

    // Check if drop exists
    const drop = await Drop.findById(dropId);
    if (!drop) return res.send("Drop not found");

    // Create claim
    try {
      await Claim.create({ user: userId, drop: dropId });
      console.log(`User ${userId} claimed drop ${dropId}`);
    } catch (err) {
      // Handle duplicate claim
      if (err.code === 11000) {
        return res.send("You already claimed this drop");
      }
      throw err;
    }

    res.redirect("/drops");
  } catch (err) {
    console.error("Claim error:", err);
    res.send("Error claiming drop: " + err.message);
  }
};



