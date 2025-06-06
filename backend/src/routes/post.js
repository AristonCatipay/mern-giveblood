const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
} = require("../controllers/post");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: http://localhost:3000/api/posts/
router.post("/", authMiddleware, createPost);

// GET: http://localhost:3000/api/posts/
router.get("/", authMiddleware, getAllPosts);

// GET: http://localhost:3000/api/posts/:id
router.get("/:id", authMiddleware, getPost);

// DELETE: http://localhost:3000/api/posts/:id
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
