const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const User = require("./models/User");
const Drop = require("./models/FruitDrop"); // ✅ Import Drop model
const cron = require("node-cron");          // ✅ Import node-cron

// Connect DB
connectDB();

// View engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/membership", require("./routes/membershipRoutes"));
app.use("/drops", require("./routes/dropRoutes"));
app.use("/api/admin", require("./routes/admin/authRoutes"));
app.use("/api/admin/drops", require("./routes/admin/adminDropRoutes"));
app.use("/api/admin", require("./routes/admin/adminAnalyticsRoutes"));

// Home redirect
app.get("/", (req, res) => res.render("auth/login"));
app.get("/admin", (req, res) => res.redirect("/api/admin/login"));

// ------------------ CRON JOB ------------------
// This will run every minute and delete expired drops
cron.schedule("* * * * *", async () => {
  try {
    console.log("****")
    const now = new Date();
    const result = await Drop.deleteMany({ endTime: { $lte: now } });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} expired drops`);
    }
  } catch (err) {
    console.error("Error deleting expired drops:", err);
  }
});
// ------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
