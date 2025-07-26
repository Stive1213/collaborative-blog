const db = require("../db/knex");

// Helper to get interaction counts for a post
const getCounts = async (postId) => {
  const [likes] = await db("likes")
    .count("* as count")
    .where({ post_id: postId });
  const [comments] = await db("comments")
    .count("* as count")
    .where({ post_id: postId });
  const [favorites] = await db("favorites")
    .count("* as count")
    .where({ post_id: postId });
  const [reposts] = await db("reposts")
    .count("* as count")
    .where({ original_post_id: postId });
  const [shares] = await db("shares")
    .count("* as count")
    .where({ post_id: postId });
  return {
    like_count: likes.count,
    comment_count: comments.count,
    favorite_count: favorites.count,
    repost_count: reposts.count,
    share_count: shares.count,
  };
};

//  Create Post
const createPost = async (req, res) => {
  const { user_id, title, content } = req.body;
  const image = req.file;

  if (!user_id || !title || !content) {
    return res.status(400).json({ message: "Missing fields" });
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
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};

//  Get All Posts (with interaction counts & author)
const getAllPosts = async (req, res) => {
  try {
    const posts = await db("posts")
      .select("posts.*", "users.name as author_name", "users.id as author_id")
      .join("users", "users.id", "posts.user_id")
      .orderBy([
        { column: "pin", order: "desc" },
        { column: "created_at", order: "desc" },
      ]);

    const enriched = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        author: { id: post.author_id, name: post.author_name },
        ...(await getCounts(post.id)),
      }))
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// Get Single Post with Comments
const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db("posts")
      .select("posts.*", "users.name as author_name", "users.id as author_id")
      .join("users", "users.id", "posts.user_id")
      .where("posts.id", id)
      .first();

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await db("comments")
      .select("comments.*", "users.name as commenter_name")
      .join("users", "comments.user_id", "users.id")
      .where({ post_id: id });

    res.json({
      ...post,
      author: { id: post.author_id, name: post.author_name },
      comments,
      ...(await getCounts(post.id)),
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting post" });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, pin } = req.body;
  const image = req.file; // multer handles this

  try {
    const post = await db("posts").where({ id }).first();
    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedFields = {
      title: title || post.title,
      content: content || post.content,
      pin: pin !== undefined ? pin : post.pin,
    };

    // Only update image if new one is uploaded
    if (image) {
      updatedFields.image_path = `uploads/${image.filename}`;
    }

    await db("posts").where({ id }).update(updatedFields);

    const updated = await db("posts").where({ id }).first();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating post" });
  }
};

//  Delete Post
const deletePost = async (req, res) => {
  const { id } = req.params;
  const { user_id, is_admin } = req.body;

  const post = await db("posts").where({ id }).first();
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user_id !== +user_id && !is_admin) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await db("posts").where({ id }).del();
  res.json({ message: "Post deleted" });
};

// Comment
const commentOnPost = async (req, res) => {
  const { user_id, post_id, content } = req.body;
  if (!content) return res.status(400).json({ message: "Empty comment" });

  await db("comments").insert({ user_id, post_id, content });
  res.json({ message: "Comment added" });
};

// Delete Comment
const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { user_id, is_post_owner } = req.body;

  const comment = await db("comments").where({ id: comment_id }).first();
  if (!comment) return res.status(404).json({ message: "Not found" });

  if (comment.user_id !== +user_id && !is_post_owner) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await db("comments").where({ id: comment_id }).del();
  res.json({ message: "Comment deleted" });
};

//  Like/Unlike
const likePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  const exists = await db("likes").where({ user_id, post_id }).first();
  if (exists) {
    await db("likes").where({ user_id, post_id }).del();
    return res.json({ message: "Unliked" });
  } else {
    await db("likes").insert({ user_id, post_id });
    return res.json({ message: "Liked" });
  }
};

//  Repost/Remove
const repostPost = async (req, res) => {
  const { user_id, post_id } = req.body;
  const exists = await db("reposts")
    .where({ user_id, original_post_id: post_id })
    .first();
  if (exists) {
    await db("reposts").where({ user_id, original_post_id: post_id }).del();
    return res.json({ message: "Repost removed" });
  } else {
    await db("reposts").insert({ user_id, original_post_id: post_id });
    return res.json({ message: "Reposted" });
  }
};

//  Save/Unsave
const savePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  const exists = await db("favorites").where({ user_id, post_id }).first();
  if (exists) {
    await db("favorites").where({ user_id, post_id }).del();
    return res.json({ message: "Removed from saved" });
  } else {
    await db("favorites").insert({ user_id, post_id });
    return res.json({ message: "Post saved" });
  }
};

//  Share
const sharePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  await db("shares").insert({ user_id, post_id });
  res.json({ message: "Shared" });
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  repostPost,
  savePost,
  sharePost,
  commentOnPost,
  deleteComment,
};
