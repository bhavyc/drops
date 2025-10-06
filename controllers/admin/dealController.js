const Deal = require("../../models/Deal");

// Show create 24hr deal form
exports.showCreateDeal = (req, res) => {
  res.render("admin/deals/create", { error: null, user: req.user });
};

// Handle create 24hr deal
exports.createDeal = async (req, res) => {
  const { title, description, image, price, discount, featured } = req.body;

  try {
    const start = new Date();
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const deal = new Deal({
      title,
      description,
      image,
      startTime: start,
      endTime: end,
      price,
      discount: discount || 0,
      featured: featured === "on" ? true : false,
    });

    await deal.save();
    res.redirect("/api/admin/deals");
  } catch (err) {
    console.error(err);
    res.render("admin/deals/create", { error: err.message, user: req.user });
  }
};

// List active deals
exports.listDeals = async (req, res) => {
  try {
    const now = new Date();
    const deals = await Deal.find({
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).sort({ createdAt: -1 });

    res.render("admin/deals/list", { deals, user: req.user });
  } catch (err) {
    console.error(err);
    res.send("Error fetching deals");
  }
};
