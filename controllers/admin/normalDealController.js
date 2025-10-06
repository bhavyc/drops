const normalDeal = require("../../models/NewDeal");

// List all normal deals
exports.listNormalDeals = async (req, res) => {
  try {
    const normalDeals = await normalDeal.find();
    res.render("admin/normalDeals/list", { normalDeals, user: req.user });
  } catch (err) {
    console.error(err);
    res.send("Error fetching normal deals");
  }
};
exports.showCreateNormalDeal = (req, res) => {
  res.render("admin/normalDeals/create", { error: null, user: req.user });
};
exports.createNormalDeal = async (req, res) => {
  const { title, description, image, price, featured } = req.body;
  const normalDeal = new normalDeal({ title, description, image, price, featured });
  await normalDeal.save();
  res.redirect("/api/admin/normal-deals");
};