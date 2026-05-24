// models/Submission.js

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },

  code: String,
  status: String,
  result: String,

}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);