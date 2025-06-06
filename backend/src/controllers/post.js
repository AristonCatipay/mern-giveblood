const Post = require("../models/post");
const User = require("../models/user");

// POST: Create a post.
const createPost = async (req, res) => {
  const {
    title,
    description,
    patientFirstName,
    patientMiddleName,
    patientLastName,
    bagsNeeded,
  } = req.body;

  try {
    const post = await Post.create({
      title,
      description,
      patientFirstName,
      patientMiddleName,
      patientLastName,
      bagsNeeded,
      author: req.user.userId,
    });

    // Find the user and update their posts array
    const user = await User.findById(req.user.userId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Get all posts.
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Get a single post.
const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate("author", "username");

    if (!post) return res.status(404).json({ error: "No post found!" });

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE: Delete a specific post.
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "No post found!" });

    // Check if the authenticated user is the author
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "The post has been removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  deletePost,
};
