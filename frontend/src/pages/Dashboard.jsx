import React, { useEffect, useState } from "react";
import axios from "axios";

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
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {loading ? (
        <p>loading...</p>
      ) : posts.length === 0 ? (
        <p>no posts found</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-4 p-4 border rounded">
              <div className="mb-2 test-sm text-gray-500">
                By{" "}
                <a
                  href={`/profile/${post.author_id}`}
                  className="text-blue-600 hover:underLine"
                >
                  {post.author_name}
                </a>
                <span className="ml-2 text-gray-400">{post.author_email}</span>
              </div>
              <p className="text-lg font-semibold mb-1">{post.title}</p>
              <p className="mb-2">{post.content}</p>
              <div className="text-sm text-gray-600 mt-2 flex gap-4">
                <span>❤{post.like_count}</span>
                <span>💬{post.comment_count} </span>
                <span>✅{post.repost_count}</span>
                <span>✅{post.share_count}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
