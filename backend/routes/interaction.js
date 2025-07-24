const express = require("express");
const router = express.Router();
const {
  likePost,
  unlikePost,
  commentOnPost,
  deleteComment,
  savePost,
  unsavePost,
  repost,
  removeRepost,
  sharePost,
} = require("../controllers/interactionController");

// Likes
router.post("/like/:postId", likePost);
router.delete("/like/:postId", unlikePost);

// Comments
router.post("/comment/:postId", commentOnPost);
router.delete("/comment/:commentId", deleteComment);

// Saved
router.post("/save/:postId", savePost);
router.delete("/save/:postId", unsavePost);

// Repost
router.post("/repost/:postId", repost);
router.delete("/repost/:postId", removeRepost);

// Share
router.post("/share/:postId", sharePost);

module.exports = router;
