const Drop = require("../models/FruitDrop");
const Claim = require("../models/Claim");
const Deal = require("../models/Deal");
const dis=20;


exports.listDrops = async (req, res) => {
  try {
    const now = new Date();
    const drops = await Drop.find({ endTime: { $gt: now } }).sort({ startTime: 1 });

    const isMember = req.user?.isMember && req.user.membershipExpiry > now;

    // Calculate discounted price only for members
    const dropsWithPrice = drops.map(drop => {
      let finalPrice = drop.price;
      if(isMember && drop.discount) {
        finalPrice = drop.price - (drop.price * drop.discount / 100);
      }

      // Check if user already claimed
      const alreadyClaimed = drop.claimedBy?.some(
        id => id.toString() === req.user._id.toString()
      );

      return {
        ...drop.toObject(),
        finalPrice,
        alreadyClaimed
      };
    });

    res.render("drop/drops", { drops: dropsWithPrice, user: req.user, isMember });
  } catch(err) {
    console.error(err);
    res.send("Error: " + err.message);
  }
}; 

// Show single drop details
// Show single drop details
exports.showDrop = async (req, res) => {
  try {
    const drop = await Drop.findById(req.params.id);
    if (!drop) return res.send("Drop not found");

    const totalClaims = await Claim.countDocuments({ drop: drop._id });
    const alreadyClaimed = await Claim.findOne({ user: req.user._id, drop: drop._id });

    const isMember = req.user.isMember && req.user.membershipExpiry > new Date();

    // Use drop-specific discount
    const finalPrice = isMember 
      ? drop.price * (1 - (drop.discount / 100)) 
      : drop.price;

    res.render("drop/dropDetail", {
      drop,
      user: req.user,
      alreadyClaimed: !!alreadyClaimed,
      isMember,
      totalClaims,
      finalPrice // pass this to EJS
    });
  } catch (err) {
    console.error("Error in showDrop:", err);
    res.send("Error: " + err.message);
  }
};

// Claim drop (members only)
// exports.claimDrop = async (req, res) => {
//   try {
//     const user = req.user;

//     // Membership check
//     if(!user.isMember || user.membershipExpiry < new Date()) {
//       return res.send("You need an active membership to claim this drop");
//     }

//     const dropId = req.params.id;
//     const drop = await Drop.findById(dropId);
//     if(!drop) return res.send("Drop not found");

//     // Create claim
//     try {
//       await Claim.create({ user: user._id, drop: dropId });
//     } catch(err) {
//       if(err.code === 11000) return res.send("You already claimed this drop");
//       throw err;
//     }

//     res.redirect("/drops");
//   } catch(err) {
//     console.error("Claim error:", err);
//     res.send("Error claiming drop: " + err.message);
//   }
// };


exports.claimDrop = async (req, res) => {
  try {
    const user = req.user;

    if (!user.isMember || user.membershipExpiry < new Date()) {
      return res.send("You need an active membership to claim this drop");
    }

    const dropId = req.params.id;
    const drop = await Drop.findById(dropId);
    if (!drop) return res.send("Drop not found");

    // Create claim
    try {
      await Claim.create({ user: user._id, drop: dropId });
    } catch (err) {
      if (err.code === 11000) return res.send("You already claimed this drop");
      throw err;
    }

    // ✅ Emit only to this user
    const io = req.app.get("io");
    io.to(user._id.toString()).emit("claimUpdate", {
      dropId,
      message: "You claimed this drop successfully!",
    });

    res.redirect("/drops");
  } catch (err) {
    console.error("Claim error:", err);
    res.send("Error claiming drop: " + err.message);
  }
};

// Show add drop form (admin)
exports.showAddDrop = (req, res) => {
  res.render("drop/addDrop", { error: null, user: req.user });
};

// Handle add drop (admin)
exports.addDrop = async (req, res) => {
  const { title, description, image, startTime, endTime, price, featured } = req.body;
  try {
    const newDrop = new Drop({
      title,
      description,
      image,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price: price || 0,
      featured: featured === "on" ? true : false,
    });
    await newDrop.save();
    res.redirect("/drops");
  } catch (err) {
    console.error("Add Drop error:", err);
    res.render("drop/addDrop", {error: err.message, user: req.user });
  }
};
