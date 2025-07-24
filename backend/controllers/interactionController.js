const db = require("../db/knex");

//  Like a post
const likePost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const exists = await db("likes")
      .where({ user_id: userId, post_id: postId })
      .first();
    if (exists) return res.status(400).json({ message: "Already liked" });

    await db("likes").insert({ user_id: userId, post_id: postId });
    res.status(201).json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ message: "Error liking post" });
  }
};

//  Unlike
const unlikePost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    await db("likes").where({ user_id: userId, post_id: postId }).del();
    res.json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ message: "Error unliking post" });
  }
};

//  Comment
const commentOnPost = async (req, res) => {
  const { userId, content } = req.body;
  const { postId } = req.params;

  if (!content) return res.status(400).json({ message: "Comment is empty" });

  try {
    const [id] = await db("comments").insert({
      user_id: userId,
      post_id: postId,
      content,
    });

    const comment = await db("comments").where({ id }).first();
    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

//  Delete Comment (by comment owner or post owner)
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await db("comments").where({ id: commentId }).first();
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await db("posts").where({ id: comment.post_id }).first();
    if (comment.user_id !== userId && post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await db("comments").where({ id: commentId }).del();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};

//  Save post
const savePost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const alreadySaved = await db("favorites")
      .where({ user_id: userId, post_id: postId })
      .first();
    if (alreadySaved) return res.status(400).json({ message: "Already saved" });

    await db("favorites").insert({ user_id: userId, post_id: postId });
    res.status(201).json({ message: "Post saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving post" });
  }
};

// Remove from saved
const unsavePost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    await db("favorites").where({ user_id: userId, post_id: postId }).del();
    res.json({ message: "Post removed from saved" });
  } catch (err) {
    res.status(500).json({ message: "Error removing saved post" });
  }
};

//  Repost
const repost = async (req, res) => {
  const { userId, caption } = req.body;
  const { postId } = req.params;

  try {
    const already = await db("reposts")
      .where({ user_id: userId, original_post_id: postId })
      .first();
    if (already) return res.status(400).json({ message: "Already reposted" });

    await db("reposts").insert({
      user_id: userId,
      original_post_id: postId,
      caption,
    });

    res.status(201).json({ message: "Reposted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error reposting" });
  }
};

//  Remove repost
const removeRepost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    await db("reposts")
      .where({ user_id: userId, original_post_id: postId })
      .del();
    res.json({ message: "Repost removed" });
  } catch (err) {
    res.status(500).json({ message: "Error removing repost" });
  }
};

//  Share post (basic log)
const sharePost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    await db("shares").insert({ user_id: userId, post_id: postId });
    res.status(201).json({ message: "Post shared" });
  } catch (err) {
    res.status(500).json({ message: "Error sharing post" });
  }
};

module.exports = {
  likePost,
  unlikePost,
  commentOnPost,
  deleteComment,
  savePost,
  unsavePost,
  repost,
  removeRepost,
  sharePost,
};
