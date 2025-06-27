const Group = require("../models/group");
const User = require("../models/user");
const Post = require("../models/post");

const createGroup = async (req, res) => {
  const { groupName, postID } = req.body;

  try {
    // Verify the post exists
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if a group already exists for this post (optional)
    const existingGroup = await Group.findOne({ postID });
    if (existingGroup) {
      return res
        .status(400)
        .json({ error: "A group already exists for this post" });
    }

    const group = await Group.create({
      groupName,
      admin: req.user.userId,
      postID: postID,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ admin: req.user.userId });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Get a single group.
const getGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);

    if (!group) return res.status(404).json({ error: "No group found!" });

    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createGroup,
  getUserGroups,
  getGroup,
};
