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
      .leftJoin("users", "posts.user_id", "users.id")
      .leftJoin("likes", "posts.id", "likes.post_id")
      .leftJoin("comments", "posts.id", "comments.post_id")
      .leftJoin("reposts", "posts.id", "reposts.original_post_id")
      .leftJoin("shares", "posts.id", "shares.post_id")
      .groupBy("posts.id")
      .select(
        "posts.*",
        "users.name as author_name",
        "users.email as author_email",
        "users.id as author_id",
        db.raw("COUNT(DISTINCT likes.id) as like_count"),
        db.raw("COUNT(DISTINCT comments.id) as comment_count"),
        db.raw("COUNT(DISTINCT reposts.id) as repost_count"),
        db.raw("COUNT(DISTINCT shares.id) as share_count")
      )
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

const getSinglePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  try {
    const post = await db("posts")
      .leftJoin("users", "posts.user_id", "users.id")
      .leftJoin("likes", "posts.id", "likes.post_id")
      .leftJoin("reposts", "posts.id", "reposts.original_post_id")
      .leftJoin("shares", "posts.id", "shares.post_id")
      .where("posts.id", id)
      .groupBy("posts.id")
      .select(
        "posts.*",
        "users.name as author_name",
        db.raw("COUNT(DISTINCT likes.id) as like_count"),
        db.raw("COUNT(DISTINCT reposts.id) as repost_count"),
        db.raw("COUNT(DISTINCT shares.id) as share_count")
      )
      .first();

    const comments = await db("comments")
      .where({ post_id: id })
      .leftJoin("users", "comments.user_id", "users.id")
      .select("comments.*", "users.name as author_name")
      .orderBy("comments.created_at", "desc");

    let interactions = {
      liked: false,
      saved: false,
      reposted: false,
    };

    if (userId) {
      const [liked, saved, reposted] = await Promise.all([
        db("likes").where({ post_id: id, user_id: userId }).first(),
        db("favorites").where({ post_id: id, user_id: userId }).first(),
        db("reposts").where({ original_post_id: id, user_id: userId }).first(),
      ]);
      interactions = {
        liked: !!liked,
        saved: !!saved,
        reposted: !!reposted,
      };
    }

    res.json({ post, comments, interactions });
  } catch (err) {
    console.error("Error fetching post detail:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  deletePost,
  updatePost,
  getSinglePost,
};
