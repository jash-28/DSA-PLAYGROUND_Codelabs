const Message = require("../models/Message");
const mongoose = require("mongoose");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!receiver || !text) {
      return res.status(400).json({ msg: "Receiver and text are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ msg: "Invalid receiver ID" });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name role")
      .populate("receiver", "name role");

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log("GET MESSAGES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};