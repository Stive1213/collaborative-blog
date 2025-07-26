import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    const res = await axios.get("http://localhost:5000/posts");
    const myPosts = res.data.filter((post) => post.author.id === user.id);
    setPosts(myPosts);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingPost) {
        await axios.put(`http://localhost:5000/posts/${editingPost}`, formData);
      } else {
        await axios.post("http://localhost:5000/posts", formData);
      }
      setForm({ title: "", content: "", image: null });
      setEditingPost(null);
      fetchMyPosts();
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, content: post.content, image: null });
    setEditingPost(post.id);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await axios.delete(`http://localhost:5000/posts/${postId}`, {
      data: { user_id: user.id },
    });
    fetchMyPosts();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>
      <p className="text-gray-700 mb-6">
        Name: {user.name} | Email: {user.email}
      </p>

      {/* Create or Edit Post */}
      <form
        onSubmit={handleCreateOrUpdate}
        className="bg-white shadow rounded p-4 mb-6 space-y-3"
      >
        <h2 className="text-xl font-semibold">
          {editingPost ? "✏️ Edit Post" : "🆕 Create New Post"}
        </h2>
        <input
          type="text"
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          rows="4"
          placeholder="Post content"
          value={form.content}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {editingPost ? "Update Post" : "Create Post"}
        </button>
      </form>

      {/* List of My Posts */}
      <h2 className="text-xl font-semibold mb-4">📝 My Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow rounded p-4 mb-4">
          <div className="flex justify-between">
            <h3 className="font-bold">{post.title}</h3>
            <span className="text-xs text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-700 mt-2">{post.content.slice(0, 200)}...</p>
          {post.image_path && (
            <img
              src={`http://localhost:5000/${post.image_path}`}
              alt="post"
              className="mt-2 rounded w-full max-h-96 object-cover"
            />
          )}
          <div className="mt-4 flex gap-4 text-sm text-blue-600">
            <button
              onClick={() => navigate(`/posts/${post.id}`)}
              className="hover:underline"
            >
              View
            </button>
            <button
              onClick={() => handleEdit(post)}
              className="hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="hover:underline text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyProfile;
