const mongoose = require("mongoose");
const User = require("./user");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  patientFirstName: { type: String, required: true },
  patientMiddleName: { type: String, required: true },
  patientLastName: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  gender: { type: String, enum: ["Male", "Female", "Other"] },
  bagsNeeded: { type: Number, required: true },
  bloodType: {
    type: String,
    enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  },
  dateNeeded: { type: Date },
  hospitalAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },

  bloodRequestFileURL: { type: String },
  profileImage: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
