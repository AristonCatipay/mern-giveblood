const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const donorRecipientTransactionSchema = new mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  donorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  transactionStatus: {
    type: String,
    enum: ["ON-GOING", "ON-VALIDATION", "COMPLETE"],
  },
  datePostPublished: { type: Date },
  dateDonationApplicationSubmitted: { type: Date },
  dateDonorDonated: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DonorRecipientTransaction = mongoose.model(
  "DonorRecipientTransaction",
  donorRecipientTransactionSchema
);
module.exports = DonorRecipientTransaction;
