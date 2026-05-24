const axios = require("axios");
const User = require("../models/User");

// ================= RUN CODE =================
exports.runCode = async (req, res) => {
  try {
    const { code, language_id } = req.body;

    if (!code || !language_id) {
      return res.status(400).json({ msg: "Code and language_id are required" });
    }

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: language_id,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "YOUR_API_KEY",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    res.json({
      output: response.data.stdout || "",
      error: response.data.stderr || "",
      status: response.data.status?.description || "",
    });
  } catch (err) {
    console.log("RUN CODE ERROR:", err.response?.data || err.message);
    res.status(500).json({
      msg: "Execution error",
      error: err.response?.data || err.message,
    });
  }
};

// ================= GET ALL USERS EXCEPT LOGGED-IN USER =================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      "name email role"
    ).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};