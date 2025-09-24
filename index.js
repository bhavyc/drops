// const express = require("express");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const cookieParser = require("cookie-parser");
// const app = express();
// const User=require("./models/User");

 

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
// app.use("/api/auth", authRoutes);                // User routes
// app.use("/membership", require("./routes/membershipRoutes"));  
// app.use("/drops", require("./routes/dropRoutes"));  
// app.use("/api/admin", require("./routes/admin/authRoutes"));
// app.use("/api/admin/drops", require("./routes/admin/adminDropRoutes"));  
// app.use("/api/admin", require("./routes/admin/adminAnalyticsRoutes")); 
// // Admin routes

// // Home redirect
// app.get("/", (req, res) => res.render("auth/login"));
// app.get("/admin", (req, res) => res.redirect("/api/admin/login"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const User = require("./models/User");

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

// ✅ HTTP server & Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // testing ke liye
});

// User-specific rooms
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room with userId
  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io for controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
