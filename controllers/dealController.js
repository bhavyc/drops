const Deal = require("../models/Deal");

// List active deals
exports.listActiveDeals = async (req, res) => {
  try {
    const now = new Date();
    const deals = await Deal.find({
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).sort({ createdAt: -1 });

    res.render("deals/list", {
      deals,
      user: req.user || null // safe fallback
    });
  } catch (err) {
    console.error(err);
    res.send("Error fetching deals");
  }
};

// Claim a deal
exports.claimDeal = async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("Login required");

    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).send("Deal not found");

    const userId = req.user._id;

    // already claimed
    if (deal.claimedBy.includes(userId)) {
      return res.status(400).send("You have already claimed this deal");
    }

    // deal active check
    const now = new Date();
    if (now > deal.endTime) {
      return res.status(400).send("Deal expired");
    }

    // add user
    deal.claimedBy.push(userId);
    await deal.save();

    res.redirect("/api/deals"); // redirect to deals page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error claiming deal");
  }
};

// exports.listActiveDeals = async (req, res) => {
//   try {
//     const now = new Date();
//     const deals = await Deal.find({
//       startTime: { $lte: now },
//       endTime: { $gte: now }
//     }).sort({ createdAt: -1 });

//     res.render("deals/list", {
//       deals,
//       user: req.user || null // safe fallback
//     });
//   } catch (err) {
//     console.error(err);
//     res.send("Error fetching deals");
//   }
// };

// // Claim a deal
// exports.claimDeal = async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).send("Login required");

//     const deal = await Deal.findById(req.params.id);
//     if (!deal) return res.status(404).send("Deal not found");

//     const userId = req.user._id;

//     // already claimed
//     if (deal.claimedBy.includes(userId)) {
//       return res.status(400).send("You have already claimed this deal");
//     }

//     // deal active check
//     const now = new Date();
//     if (now > deal.endTime) {
//       return res.status(400).send("Deal expired");
//     }

//     // add user
//     deal.claimedBy.push(userId);
//     await deal.save();

//     res.redirect("/api/deals"); // redirect to deals page
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error claiming deal");
//   }
// };
