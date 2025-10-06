const mongoose = require("mongoose");
const newDealSchema = new mongoose.Schema({
    title: 
    { 
    type: String,
    required: true 
    },
    description:
     {
         type: String,
          required: true 
        }, 
    image:
     {   
        type: String, 
        required: true 
    },
    price: {
         type: Number,
          required: true 
        },
    featured: 
    { type: Boolean,
         default: false
         },
}, { 
    timestamps: true
 }
);

module.exports = mongoose.model("NewDeal", newDealSchema);