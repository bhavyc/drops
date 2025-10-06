 const normalDeal = require("../models/NewDeal");
 

// Get all deals
exports.getDeals = async (req, res) => {
  try {
    const deals = await normalDeal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get featured deals
exports.getFeaturedDeals = async (req, res) => {
  try {
    const featuredDeals = await normalDeal.find({ featured: true });
    res.json(featuredDeals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.renderDealsPage = async (req, res) => {
  try {
    const deals = await normalDeal.find();
    res.render("normalDeals/list", { deals });
  } catch (err) {
    res.status(500).send("Error loading deals: " + err.message);
  }
};
