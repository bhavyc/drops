 
const mongoose = require("mongoose");

const fruitDropSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  price: { type: Number, required: true }, 
 discount: { type: Number, default: 0 }, // <-- discount in percent
  claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Drop", fruitDropSchema);

