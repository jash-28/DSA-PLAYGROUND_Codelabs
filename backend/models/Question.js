// models/Question.js

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },

  testCases: [
    {
      input: String,
      output: String,
    }
  ],

  starterCode: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }

}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);