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
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, pin } = req.body;
  const image = req.file;

  try {
    const post = await db("posts").where({ id }).first();
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    const image_path = image ? `uploads/${image.filename}` : post.image_path;

    await db("posts")
      .where({ id })
      .update({
        title: title || post.title,
        content: content || post.content,
        pin: pin !== undefined ? pin : post.pin,
        image_path,
      });

    const updatePost = await db("posts").where({ id }).first();

    res
      .status(200)
      .json({ message: "post updated successfully", post: updatePost });
  } catch (err) {
    console.error("error updating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await db("posts")
      .join("users", "posts.user_id", "users.id")
      .select("posts.*", "users.name as author_name", "users.id as author_id")
      .orderBy("posts.created_at", "desc");
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

module.exports = { createPost, getAllPosts, deletePost, updatePost };
