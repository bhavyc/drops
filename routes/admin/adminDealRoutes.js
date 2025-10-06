const express = require("express");
const router = express.Router();
const dealController = require("../../controllers/admin/dealController");

// Deals routes
router.get("/", dealController.listDeals);
router.get("/create", dealController.showCreateDeal);
router.post("/create", dealController.createDeal);

module.exports = router;
