const Course = require("../models/Course");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "name email role")
      .populate("modules")
      .populate("students", "name email role")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description are required" });
    }

    let thumbnailUrl = "";

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "dsa_playground/courses",
      });

      thumbnailUrl = result.secure_url;
    }

    const course = await Course.create({
      title,
      description,
      thumbnail: thumbnailUrl,
      createdBy: req.user.id,
    });

    res.status(201).json(course);
  } catch (err) {
    console.log("CREATE COURSE ERROR:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

// ENROLL COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (!user.enrolledCourses) {
      user.enrolledCourses = [];
    }

    if (!user.enrolledCourses.includes(req.params.courseId)) {
      user.enrolledCourses.push(req.params.courseId);
      await user.save();
    }

    if (!course.students.includes(req.user.id)) {
      course.students.push(req.user.id);
      await course.save();
    }

    res.json({ msg: "Enrolled successfully" });
  } catch (err) {
    console.log("ENROLL ERROR:", err.message);
    res.status(500).json({ msg: "Enroll failed" });
  }
};

// GET ENROLLED COURSES
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.enrolledCourses || []);
  } catch (err) {
    console.log("GET ENROLLED ERROR:", err.message);
    res.status(500).json({ msg: err.message });
  }
};

// GET COURSE BY ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("modules")
      .populate("students", "name email role");

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.log("GET COURSE BY ID ERROR:", err.message);
    res.status(500).json({ msg: err.message });
  }
};