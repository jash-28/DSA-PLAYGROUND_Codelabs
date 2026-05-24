const axios = require("axios");
const Submission = require("../models/Submission");

// 🔥 RUN CODE (NEW)
exports.runCode = async (req, res) => {
  try {
    const { code, language_id } = req.body;

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: language_id,
        stdin: ""
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "YOUR_API_KEY",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );

    res.json({
      output: response.data.stdout,
      error: response.data.stderr
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Execution error" });
  }
};

// ✅ SUBMIT CODE (existing)
exports.submitCode = async (req, res) => {
  try {
    const { code } = req.body;

    const submission = await Submission.create({
      userId: req.user.id,
      code
    });

    res.json(submission);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Submission error" });
  }
};