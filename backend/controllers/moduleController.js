const Module = require("../models/Module");

// ================= ADD MODULE (TEACHER) =================
exports.addModule = async (req, res) => {
  try {
    const { title, content, course } = req.body;

    const module = await Module.create({
      title,
      content,
      course
    });

    res.json(module);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to add module" });
  }
};

// ================= GET MODULES BY COURSE =================
exports.getModulesByCourse = async (req, res) => {
  try {
    const modules = await Module.find({
      course: req.params.courseId
    }).sort({ createdAt: 1 });

    res.json(modules);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to fetch modules" });
  }
};

// ================= GET SINGLE MODULE =================
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({ msg: "Module not found" });
    }

    res.json(module);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching module" });
  }
};

// ================= DELETE MODULE =================
exports.deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ msg: "Module deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};