const express = require("express");
const router = express.Router();
const dealController = require("../controllers/normalDealController");

// Routes
 
router.get("/", dealController.getDeals);
router.get("/featured", dealController.getFeaturedDeals);
router.get("/list", dealController.renderDealsPage);

module.exports = router;
