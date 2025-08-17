const Message = require("../models/message.model");
const mongoose = require("mongoose");

exports.fetchAllMessages = async ({ from, to, limit = 500 }) => {
  if (!mongoose.isValidObjectId(from) || !mongoose.isValidObjectId(to)) {
    throw new Error("Invalid user ids");
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

  return messages;
};

exports.createMessage = async ({ text, from, to }) => {
  return Message.create({ text, from, to });
};
