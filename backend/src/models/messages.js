const mongoose = require("mongoose");
const Group = require("./group");
const User = require("./user");

const messagesSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  datePublished: { type: Date },
  profileImage: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Messages = mongoose.model("Messages", messagesSchema);
module.exports = Messages;
