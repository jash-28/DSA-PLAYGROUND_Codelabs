// app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session (for EJS SSR)
app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Static files for EJS
app.use(express.static(path.join(__dirname, "public")));

// ================= EJS SETUP =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/modules", require("./routes/moduleRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/users", require("./routes/userRoutes")); // ✅ ADD THIS

// ================= SSR ROUTES =================
app.get("/login", (req, res) => res.render("login"));
app.get("/verify", (req, res) => res.render("verifyOtp"));

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;