// require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const dropRoutes = require("./routes/dropRoutes");
const app = express();
connectDB();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(cookieParser());
// Middleware
app.use(bodyParser.json());
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.render("auth/index");
});
app.use("/drops", require("./routes/dropRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
