import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [interactions, setInteractions] = useState({
    liked: false,
    saved: false,
    reposted: false,
  });

  useEffect(() => {
    fetchPost();
    fetchUserInteraction();
  }, [id, user]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${id}`);
      setPost(res.data.post);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching post", err);
    }
  };

  const fetchUserInteraction = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/interact/status/${id}?userId=${user.id}`
      );
      setInteractions(res.data);
    } catch (err) {
      console.error("Error fetching interaction status", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user?.id) return;
    try {
      await axios.post(`http://localhost:5000/interact/comment/${id}`, {
        userId: user.id,
        content: newComment,
      });
      setNewComment("");
      fetchPost();
      fetchUserInteraction();
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    const url = `http://localhost:5000/interact/like/${id}`;
    try {
      if (interactions.liked) {
        await axios.delete(url, { data: { userId: user.id } });
      } else {
        await axios.post(url, { userId: user.id });
      }
      fetchPost();
      fetchUserInteraction();
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const toggleSave = async () => {
    if (!user) return;
    const url = `http://localhost:5000/interact/save/${id}`;
    try {
      if (interactions.saved) {
        await axios.delete(url, { data: { userId: user.id } });
      } else {
        await axios.post(url, { userId: user.id });
      }
      fetchPost();
      fetchUserInteraction();
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  const toggleRepost = async () => {
    if (!user) return;
    const url = `http://localhost:5000/interact/repost/${id}`;
    try {
      if (interactions.reposted) {
        await axios.delete(url, { data: { userId: user.id } });
      } else {
        await axios.post(url, { userId: user.id, caption: "" });
      }
      fetchPost();
      fetchUserInteraction();
    } catch (err) {
      console.error("Failed to toggle repost", err);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    try {
      await axios.post(`http://localhost:5000/interact/share/${id}`, {
        userId: user.id,
      });
      const url = `${window.location.origin}/post/${id}`;
      await navigator.clipboard.writeText(url);
      alert("🔗 Link copied to clipboard!");
      fetchPost();
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">By {post.author_name}</p>

      {post.image_path && (
        <img
          src={`http://localhost:5000/${post.image_path}`}
          alt="Post"
          className="w-full rounded mb-4"
        />
      )}

      <p className="whitespace-pre-line mb-4">{post.content}</p>

      {/* Interaction Buttons */}
      <div className="flex gap-6 text-gray-700 mb-4 text-sm items-center">
        <button onClick={toggleLike} className="hover:underline">
          {interactions.liked ? "💔 Unlike" : "❤️ Like"} ({post.like_count || 0}
          )
        </button>
        <button onClick={toggleRepost} className="hover:underline">
          {interactions.reposted ? "🔁 Remove Repost" : "🔁 Repost"} (
          {post.repost_count || 0})
        </button>
        <button onClick={handleShare} className="hover:underline">
          🔗 Share ({post.share_count || 0})
        </button>
        <button onClick={toggleSave} className="hover:underline">
          {interactions.saved ? "⭐ Unsave" : "⭐ Save"}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Comments</h3>
        <ul className="mb-4 space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="border rounded p-2">
              <p className="text-sm text-gray-500">
                By {comment.author_name || `user #${comment.user_id}`}
              </p>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>

        {user ? (
          <>
            <textarea
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded p-2 mb-2"
            ></textarea>
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Comment
            </button>
          </>
        ) : (
          <p className="text-sm italic text-gray-500">Log in to comment.</p>
        )}
      </div>
    </div>
  );
}

export default PostDetailPage;
