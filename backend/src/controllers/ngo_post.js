const NGOPost = require("../models/ngo_post");
const User = require("../models/user");

// POST: Create a NGO post.
const createNGOPost = async (req, res) => {
  const { username, description } = req.body;

  try {
    const ngopost = await NGOPost.create({
      username,
      description,
      author: req.user.userId,
    });

    // Find the user and update their posts array
    // const user = await User.findById(req.user.userId);
    // if (user) {
    //   user.posts.push(post._id);
    //   await user.save();
    // }

    res.status(201).json(ngopost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllNGOPosts = async (req, res) => {
  try {
    const NGOPosts = await NGOPost.find().populate("author", "username");
    res.status(200).json(NGOPosts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Get a single NGO post.
const getNGOPost = async (req, res) => {
  const { id } = req.params;

  try {
    const NGOPost = await NGOPost.findById(id).populate("author", "username");

    if (!NGOPost) return res.status(404).json({ error: "No post found!" });

    res.status(200).json(NGOPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createNGOPost,
  getAllNGOPosts,
  getNGOPost,
};
