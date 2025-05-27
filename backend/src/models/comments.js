const mongoose = require("mongoose");
const NGOPost = require("./ngo_post");
const User = require("./user");

const commentsSchema = new mongoose.Schema({
  NGOPostID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGOPost",
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

const Comments = mongoose.model("Comments", commentsSchema);
module.exports = Comments;
