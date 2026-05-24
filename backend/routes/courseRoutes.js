const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  enrollCourse,
  getEnrolledCourses,
  getCourseById
} = require("../controllers/courseController");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ================= ROUTES =================

// Get all courses
router.get("/", auth, getAllCourses);

// Get enrolled courses
router.get("/enrolled", auth, getEnrolledCourses);

// Enroll in course
router.post("/enroll/:courseId", auth, enrollCourse);

// Create course with thumbnail upload
router.post("/create", auth, upload.single("thumbnail"), createCourse);

// Keep this last
router.get("/:id", auth, getCourseById);

module.exports = router;