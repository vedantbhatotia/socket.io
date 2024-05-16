const express = require("express");
const {
  sendMessage,
  allMessages
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/:chatId",protect, allMessages);
router.post("/",protect, sendMessage);

module.exports = router;