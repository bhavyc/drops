const mongoose = require("mongoose");


const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  featured: { type: Boolean, default: false },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
  
// TTL Index → endTime ke 0 sec baad document delete
dealSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Deal", dealSchema);
