const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const controller = require("../controllers/postController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Post routes
router.post("/", upload.single("image"), controller.createPost);
router.get("/", controller.getAllPosts);
router.get("/:id", controller.getSinglePost);
router.put("/:id", upload.single("image"), controller.updatePost);
router.delete("/:id", controller.deletePost);

// Interactions
router.post("/like", controller.likePost);
router.post("/repost", controller.repostPost);
router.post("/save", controller.savePost);
router.post("/share", controller.sharePost);
router.post("/comment", controller.commentOnPost);
router.delete("/comment/:comment_id", controller.deleteComment);

module.exports = router;
