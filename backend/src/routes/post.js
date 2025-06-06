const express = require("express");
const router = express.Router();
const { createPost } = require("../controllers/post");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: http://localhost:3000/api/posts/
router.post("/", authMiddleware, createPost);

module.exports = router;
