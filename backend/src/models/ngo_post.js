const mongoose = require("mongoose");
const User = require("./user");

const ngoPostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NGOPost = mongoose.model("NGOPost", ngoPostSchema);
module.exports = NGOPost;
