// controllers/chatController.js

const Message = require("../models/Message");

exports.saveMessage = async (data) => {
  try {
    await Message.create(data);
  } catch (err) {
    console.log(err.message);
  }
};