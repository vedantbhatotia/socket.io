const asyncHandler = require("express-async-handler");
const Message = require('../models/MessageModel');
const User = require('../models/UserModel')
const Chat = require('../models/chatModel');
const allMessages = asyncHandler(async(req,res)=>{
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    console.log(content, chatId);
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    try {
      const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };
  
      let message = await Message.create(newMessage);
      console.log(message);
      message = await message.populate("sender", "name pic");
      console.log(message);
      message = await message.populate("chat");
      console.log(message);
      message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
      console.log(message);
  
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
      return res.status(200).json(message);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  });
  
module.exports = {sendMessage,allMessages};