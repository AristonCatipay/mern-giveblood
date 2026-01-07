const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  applyForDonation,
  updateTransactionStatus,
} = require("../controllers/donorRecipientTransaction");

// POST: Apply as donor
router.post("/", authMiddleware, applyForDonation);

// PUT: Update transaction status
router.put("/:transactionId", authMiddleware, updateTransactionStatus);

module.exports = router;
