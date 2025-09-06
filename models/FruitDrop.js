const mongoose = require("mongoose");

const fruitDropSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Drop", fruitDropSchema);
