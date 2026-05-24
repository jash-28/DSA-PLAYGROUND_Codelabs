const express = require("express");
const router = express.Router();

const { submitCode, runCode } = require("../controllers/submissionController");

const auth = require("../middleware/authMiddleware");

// 🔥 Run code (NEW)
router.post("/run", auth, runCode);

// Submit solution (save to DB)
router.post("/submit", auth, submitCode);

// Test route
router.get("/", (req, res) => {
  res.send("Submission API working");
});

module.exports = router;