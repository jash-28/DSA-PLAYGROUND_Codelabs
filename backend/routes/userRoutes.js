const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  getAllUsers,
  runCode,
} = require("../controllers/userController");

// Get all users except logged-in user
router.get("/", auth, getAllUsers);

// Run code
router.post("/run", auth, runCode);

module.exports = router;