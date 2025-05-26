const mongoose = require("mongoose");
const Post = require("./post");

const groupSchema = new mongoose.Schema({
  admin: { type: String, required: true },
  adminName: { type: String, required: true },
  groupName: { type: String, required: true },
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  datePublished: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
