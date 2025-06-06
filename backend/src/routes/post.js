const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
  updatePost,
  getUserPosts,
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

// PUT: http://localhost:3000/api/posts/:id
router.put("/:id", authMiddleware, updatePost);

// GET: http://localhost:3000/api/posts/user/me
router.get("/user/me", authMiddleware, getUserPosts);

module.exports = router;
