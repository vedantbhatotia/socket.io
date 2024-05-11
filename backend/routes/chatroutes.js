const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {accessChat,fetchChats,createGroupChat,addToGroup} = require('../controllers/chatController')
router.post('/',protect,accessChat);
router.get('/',protect,fetchChats);
router.post("/group",protect, createGroupChat);
router.put("/groupadd",protect, addToGroup);
module.exports = router;