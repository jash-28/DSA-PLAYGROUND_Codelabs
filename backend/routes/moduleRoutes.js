const express = require("express");
const router = express.Router();

const {
  addModule,
  getModulesByCourse,
  getModuleById,
  deleteModule
} = require("../controllers/moduleController");

const auth = require("../middleware/authMiddleware");
const isTeacher = require("../middleware/roleMiddleware");

// Add module (teacher only)
router.post("/add", auth, isTeacher, addModule);

// 🔥 Get modules for course (IMPORTANT)
router.get("/:courseId", auth, getModulesByCourse);

// Get single module
router.get("/single/:id", auth, getModuleById);

// Delete module
router.delete("/:id", auth, isTeacher, deleteModule);

module.exports = router;