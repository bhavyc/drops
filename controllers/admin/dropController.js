 
const Drop = require("../../models/FruitDrop");

// List all drops
exports.listDrops = async (req, res) => {
  try {
    const drops = await Drop.find().sort({ startTime: -1 });
    res.render("admin/drops/list", { drops, user: req.user });
  } catch (err) {
    console.error(err);
    res.send("Error fetching drops");
  }
};

// Show create drop form
exports.showCreateDrop = (req, res) => {
  res.render("admin/drops/create", { error: null, user: req.user });
};

// Handle create drop form
exports.createDrop = async (req, res) => {
  const { title, description, image, startTime, endTime, price, featured, discount } = req.body;

  try {
    const drop = new Drop({
      title,
      description,
      image,
      startTime,
      endTime,
      price,
      discount: discount || 0, // <-- save discount percentage
      featured: featured === "on" ? true : false,
    });

    await drop.save();
    res.redirect("/api/admin/drops");
  } catch (err) {
    console.error(err);
    res.render("admin/drops/create", { error: err.message, user: req.user });
  }
};
 