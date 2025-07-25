import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("error fetching posts", err);
        setLoading(false);
      });
  }, []);

  const truncateText = (text, limit = 3) => {
    const lines = text.split("\n");
    return lines.length > limit
      ? lines.slice(0, limit).join("\n") + "..."
      : text;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {loading ? (
        <p>loading...</p>
      ) : posts.length === 0 ? (
        <p>no posts found</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li
              key={post.id}
              className="mb-6 p-4 border rounded bg-gray-50 shadow hover:bg-gray-100 transition"
            >
              <Link to={`/post/${post.id}`}>
                <p className="text-sm text-gray-500">
                  By <span className="font-medium">{post.author_name}</span>
                </p>
                {post.image_path && (
                  <img
                    src={`http://localhost:5000/${post.image_path}`}
                    alt="Post"
                    className="w-full h-48 object-cover my-2 rounded"
                  />
                )}
                <p className="text-lg font-semibold">{post.title}</p>
                <p className="text-gray-700 whitespace-pre-line">
                  {truncateText(post.content)}
                </p>
              </Link>

              {/* Interaction Buttons */}
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <button>❤️ {post.like_count}</button>
                <button>💬 {post.comment_count}</button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `http://localhost:5173/post/${post.id}`
                    )
                  }
                >
                  🔗 Share
                </button>
                <button>🔁</button>
                <button>⭐</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
