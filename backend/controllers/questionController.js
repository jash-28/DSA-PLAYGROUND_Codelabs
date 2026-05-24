// controllers/questionController.js

const Question = require("../models/Question");

exports.addQuestion = async (req, res) => {
  try {
    const data = req.body;

    const question = await Question.create({
      ...data,
      createdBy: req.user.id,
    });

    res.json(question);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};