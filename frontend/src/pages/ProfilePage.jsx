import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { id } = useParams(); // user ID from URL
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const allPosts = await axios.get("http://localhost:5000/posts");
      const userPosts = allPosts.data.filter(
        (post) => post.author.id === Number(id)
      );
      if (userPosts.length > 0) {
        setProfile(userPosts[0].author); // author info
      }
      setPosts(userPosts);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const toggleInteraction = async (action, postId) => {
    await axios.post(`http://localhost:5000/posts/${action}`, {
      user_id: user.id,
      post_id: postId,
    });
    fetchPosts(); // refresh counts
  };

  const sharePost = async (postId) => {
    await axios.post("http://localhost:5000/posts/share", {
      user_id: user.id,
      post_id: postId,
    });
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
    alert("Post link copied!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {profile ? (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-600">User ID: {profile.id}</p>
        </div>
      ) : (
        <p className="text-center">User not found or no posts yet.</p>
      )}

      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between">
            <span className="text-blue-600 font-semibold">{profile.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          <div
            className="mt-2 cursor-pointer"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-gray-700">
              {post.content.split("\n").slice(0, 3).join("\n")}...
            </p>
            {post.image_path && (
              <img
                src={`http://localhost:5000/${post.image_path}`}
                alt="post"
                className="mt-2 rounded w-full max-h-96 object-cover"
              />
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <div className="flex gap-4">
              <button
                onClick={() => toggleInteraction("like", post.id)}
                className="hover:text-red-500"
              >
                ❤️ {post.like_count}
              </button>
              <button
                onClick={() => sharePost(post.id)}
                className="hover:text-blue-500"
              >
                📤 {post.share_count}
              </button>
              <button
                onClick={() => toggleInteraction("repost", post.id)}
                className="hover:text-green-600"
              >
                🔁 {post.repost_count}
              </button>
              <button
                onClick={() => toggleInteraction("save", post.id)}
                className="hover:text-yellow-600"
              >
                ⭐ {post.favorite_count}
              </button>
            </div>
            <span>{post.comment_count} comments</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfilePage;
