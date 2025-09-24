// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema= new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "admin"], default: "user" },

//     // 👇 Membership fields
//     isMember: { type: Boolean, default: false },
//     membershipExpiry: { type: Date },  // optional, agar tum subscription type karna chahte ho

//     createdAt: { type: Date, default: Date.now }
// });

// // Hash password before saving
// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // Method to compare password
// userSchema.methods.comparePassword = async function(password) {
//     return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model("User", userSchema);


 const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Claim = require("./Claim");
const Drop = require("./FruitDrop");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    //  Membership fields
    isMember: { type: Boolean, default: false },
    membershipExpiry: { type: Date },

    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Cascade delete middleware
userSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
    try {
        const userId = this._id;

        // Delete all claims by this user
        await Claim.deleteMany({ user: userId });

        // Remove user from Drops' claimedBy arrays
        await Drop.updateMany(
            { claimedBy: userId },
            { $pull: { claimedBy: userId } }
        );

        console.log(`Cleanup done for user ${userId}`);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("User", userSchema);
