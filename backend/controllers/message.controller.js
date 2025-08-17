const Message = require("../models/message.model");
const mongoose = require("mongoose");

const fetchAllMessages = async ({ from, to, limit = 500 }) => {
  if (!mongoose.isValidObjectId(from) || !mongoose.isValidObjectId(to)) {
    return console.log("Error: Invalid user IDs");
  }
  const fromId = new mongoose.Types.ObjectId(from);
  const toId = new mongoose.Types.ObjectId(to);

  const messages = await Message.find({
    $or: [
      { from: fromId, to: toId },
      { from: toId, to: fromId },
    ],
  })
    .sort({ createdAt: 1 })          // oldest → newest
    .limit(Math.min(limit, 2000));   // safety

    console.log("All messages ==> ", messages);
  return messages;
};

const createMessage = async ({ text, from, to }) => {
  return Message.create({ text, from, to });
};


module.exports = {
  fetchAllMessages,
  createMessage,
};