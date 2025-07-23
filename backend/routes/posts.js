const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAllPosts,
  createPost,
  deletePost,
} = require("../controllers/postController");

//storege configuration for multer
const storage = multer.diskStorage({
  destinantion: function (re, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createPost);
router.get("/", getAllPosts);
router.delete("/:id", deletePost);

module.exports = router;
