const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages
} = require("../controllers/messageController");

const auth = require("../middleware/authMiddleware");

router.post("/send", auth, sendMessage);
router.get("/:userId", auth, getMessages);

module.exports = router;   // ✅ MUST BE THIS