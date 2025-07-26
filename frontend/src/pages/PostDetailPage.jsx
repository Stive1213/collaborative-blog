import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error loading post:", err);
    }
  };

  const handleInteraction = async (action) => {
    try {
      await axios.post(`http://localhost:5000/posts/${action}`, {
        user_id: user.id,
        post_id: post.id,
      });
      fetchPost(); // refresh counts
    } catch (err) {
      console.error(`Failed to ${action}:`, err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post("http://localhost:5000/posts/comment", {
        user_id: user.id,
        post_id: post.id,
        content: newComment,
      });
      setNewComment("");
      fetchPost(); // refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (comment_id, comment_user_id) => {
    const is_post_owner = post.user_id === user.id;
    const is_comment_owner = comment_user_id === user.id;

    if (!is_post_owner && !is_comment_owner) return alert("Not authorized");

    try {
      await axios.delete(`http://localhost:5000/posts/comment/${comment_id}`, {
        data: { user_id: user.id, is_post_owner },
      });
      fetchPost();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const sharePost = async () => {
    await axios.post("http://localhost:5000/posts/share", {
      user_id: user.id,
      post_id: post.id,
    });
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    alert("Post link copied!");
  };

  if (!post) return <p className="text-center py-10">Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <Link
            to={`/profile/${post.author.id}`}
            className="text-blue-600 hover:underline font-semibold"
          >
            {post.author.name}
          </Link>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="whitespace-pre-line text-gray-800 mb-4">{post.content}</p>

        {post.image_path && (
          <img
            src={`http://localhost:5000/${post.image_path}`}
            alt="Post"
            className="rounded w-full max-h-96 object-cover mb-4"
          />
        )}

        <div className="flex justify-between text-gray-600 text-sm mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleInteraction("like")}
              className="hover:text-red-500"
            >
              ❤️ {post.like_count}
            </button>
            <button onClick={sharePost} className="hover:text-blue-500">
              📤 {post.share_count}
            </button>
            <button
              onClick={() => handleInteraction("repost")}
              className="hover:text-green-600"
            >
              🔁 {post.repost_count}
            </button>
            <button
              onClick={() => handleInteraction("save")}
              className="hover:text-yellow-500"
            >
              ⭐ {post.favorite_count}
            </button>
          </div>
          <span>{post.comment_count} comments</span>
        </div>

        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            rows="2"
            className="w-full p-2 border rounded"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </form>

        <div className="border-t pt-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{comment.commenter_name}</span>
                {(comment.user_id === user.id || user.id === post.user_id) && (
                  <button
                    className="text-xs text-red-600"
                    onClick={() =>
                      handleDeleteComment(comment.id, comment.user_id)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
