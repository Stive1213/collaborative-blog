const db = require("../db/knex");

const createPost = async (req, res) => {
  const { user_id, title, content } = req.body;
  const image = req.file;

  if (!user_id || !title || !content) {
    return res
      .status(400)
      .json({ message: "user_id, title, and content are required" });
  }

  try {
    const [id] = await db("posts").insert({
      user_id,
      title,
      content,
      image_path: image ? `uploads/${image.filename}` : null,
      pin: 0,
    });
    const newPost = await db("posts").where({ id }).first();
    res
      .status(201)
      .json({ message: "post created successfully", post: newPost });
  } catch (err) {
    console.error("error creating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await db("posts").select("*").orderBy("created_at", "desc");
    res.status(200).json(posts);
  } catch (err) {
    console.error("error fetching posts:", err);
    res.status(500).json({ message: "internalserver error" });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletePost = await db("posts").where({ id }).del();
    if (deletePost) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.error("errror deleting post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPost, getAllPosts, deletePost };
