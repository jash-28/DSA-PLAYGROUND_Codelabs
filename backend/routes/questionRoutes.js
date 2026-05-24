// routes/questionRoutes.js

const express = require("express");
const router = express.Router();

const { addQuestion } = require("../controllers/questionController");

const auth = require("../middleware/authMiddleware");
const isTeacher = require("../middleware/roleMiddleware");

// Add question
router.post("/add", auth, isTeacher, addQuestion);

// Safety route (prevents crash)
router.get("/", (req, res) => {
  res.send("Questions API working");
});

module.exports = router;