const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserMe } = require("../controllers/user");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: http://localhost:3000/api/users/register
router.post("/register", registerUser);

// POST: http://localhost:3000/api/users/login
router.post("/login", loginUser);

// GET: http://localhost:3000/api/users/me
router.get("/me", authMiddleware, getUserMe);

module.exports = router;
