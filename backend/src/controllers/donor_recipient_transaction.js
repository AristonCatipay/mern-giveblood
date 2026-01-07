const DonorRecipientTransaction = require("../models/donor_recipient_transaction");
const Post = require("../models/post");

// Helper to check 3-month cooldown
const isEligible = (lastDonationDate) => {
  if (!lastDonationDate) return true;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return lastDonationDate < threeMonthsAgo;
};

// POST: Apply as a donor for a specific post
const applyForDonation = async (req, res) => {
  const donorId = req.user.userId;
  const { postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check donor cooldown
    const lastTransaction = await DonorRecipientTransaction.findOne({
      donorID: donorId,
      transactionStatus: "COMPLETE",
    }).sort({ dateDonorDonated: -1 });

    if (lastTransaction && !isEligible(lastTransaction.dateDonorDonated)) {
      return res.status(400).json({
        error:
          "You are not eligible to donate yet. Please wait 3 months after your last donation.",
      });
    }

    // Create new transaction
    const transaction = await DonorRecipientTransaction.create({
      postID: postId,
      donorID: donorId,
      recipientID: post.author,
      transactionStatus: "ON-GOING",
      datePostPublished: post.createdAt,
      dateDonationApplicationSubmitted: new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT: Update transaction status (for donor or admin)
const updateTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  const validStatuses = ["ON-GOING", "ON-VALIDATION", "COMPLETE"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const transaction = await DonorRecipientTransaction.findById(transactionId);
    if (!transaction)
      return res.status(404).json({ error: "Transaction not found" });

    transaction.transactionStatus = status;

    // If status is COMPLETE, set donation date
    if (status === "COMPLETE") {
      transaction.dateDonorDonated = new Date();
    }

    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  applyForDonation,
  updateTransactionStatus,
};
