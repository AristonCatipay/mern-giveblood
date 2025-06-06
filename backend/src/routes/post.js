const express = require("express");
const router = express.Router();
const { createPost, getAllPosts } = require("../controllers/post");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: http://localhost:3000/api/posts/
router.post("/", authMiddleware, createPost);

// GET: http://localhost:3000/api/posts/
router.get("/", authMiddleware, getAllPosts);

module.exports = router;
