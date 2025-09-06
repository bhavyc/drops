const express = require("express");
const router = express.Router();
const Drop = require("../models/FruitDrop");
const mongoose = require("mongoose");
 
const {
  listDrops,
  showDrop,
  claimDrop,
  showCreateDrop,
  createDrop
} = require("../controllers/dropController");
const { protect } = require("../middleware/authMiddleware");

// User routes
router.get("/", protect, listDrops);
router.get("/:id", protect, showDrop);
router.post("/:id/claim", protect, claimDrop);

// Admin routes
// router.get("/admin/create", protect, showCreateDrop);
// router.post("/admin/create", protect, createDrop);

module.exports = router;
