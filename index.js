// index.js
require('dotenv').config(); // Load .env variables

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cron = require("node-cron");
 
const User = require("./models/User");
const Drop = require("./models/FruitDrop");

// Routes
const authRoutes = require("./routes/authRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const dropRoutes = require("./routes/dropRoutes");
const adminAuthRoutes = require("./routes/admin/authRoutes");
const adminDropRoutes = require("./routes/admin/adminDropRoutes");
const adminDealRoutes = require("./routes/admin/adminDealRoutes");
const adminAnalyticsRoutes = require("./routes/admin/adminAnalyticsRoutes");
const dealRoutes = require("./routes/dealRoutes");
const normalDealRoutes = require("./routes/normalDealRoutes");
const googleAuthRoutes = require("./routes/googleRoutes"); // Google auth routes
const adminNormalDealRoutes = require("./routes/admin/adminNormalDealRoutes");
const app = express();

// Connect DB
connectDB();

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session + Passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// ------------------ PASSPORT GOOGLE ------------------
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:5000/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//       user = await User.create({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         googleId: profile.id,
//         avatar: profile.photos[0].value
//       });
//     }

//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

// ------------------ ROUTES ------------------
app.use("/api/auth", authRoutes);
app.use("/membership", membershipRoutes);
app.use("/drops", dropRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/drops", adminDropRoutes);
app.use("/api/admin/deals", adminDealRoutes);
app.use("/api/admin", adminAnalyticsRoutes);
app.use("/api", dealRoutes);
app.use("/auth/google", googleAuthRoutes);
app.use("/api/normal-deals", normalDealRoutes);
app.use("/api/admin/normal-deals", adminNormalDealRoutes);
// Home redirect
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/drops"); // redirect logged in users
  }
  res.render("auth/login");
});
app.get("/admin", (req, res) => res.redirect("/api/admin/login"));

// ------------------ CRON JOB ------------------
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running cron job to delete expired drops...");
    const now = new Date();
    const result = await Drop.deleteMany({ endTime: { $lte: now } });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} expired drops`);
    }
  } catch (err) {
    console.error("Error deleting expired drops:", err);
  }
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// const express = require("express");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const cookieParser = require("cookie-parser");
// const app = express();
// const User = require("./models/User");
// const Drop = require("./models/FruitDrop"); // ✅ Import Drop model
// const cron = require("node-cron");          // ✅ Import node-cron

// // Connect DB
// connectDB();

// // View engine
// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");

// // Middleware
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/membership", require("./routes/membershipRoutes"));
// app.use("/drops", require("./routes/dropRoutes"));
// app.use("/api/admin", require("./routes/admin/authRoutes"));
// app.use("/api/admin/drops", require("./routes/admin/adminDropRoutes"));
// app.use("/api/admin/deals", require("./routes/admin/adminDealRoutes"));
// app.use("/api/admin", require("./routes/admin/adminAnalyticsRoutes"));
 
// app.use("/api", require("./routes/dealRoutes"));
// // Home redirect
// app.get("/", (req, res) => res.render("auth/login"));
// app.get("/admin", (req, res) => res.redirect("/api/admin/login"));

// // ------------------ CRON JOB ------------------
// // This will run every minute and delete expired drops
// cron.schedule("* * * * *", async () => {
//   try {
//     console.log("****")
//     const now = new Date();
//     const result = await Drop.deleteMany({ endTime: { $lte: now } });
//     if (result.deletedCount > 0) {
//       console.log(`Deleted ${result.deletedCount} expired drops`);
//     }
//   } catch (err) {
//     console.error("Error deleting expired drops:", err);
//   }
// });
// // ------------------------------------------------

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
