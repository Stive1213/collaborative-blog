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
              <div>
                <p className="text-sm test-gray-500">
                  By <strong>{post.author_name}</strong>
                </p>
                <p className="text-lg font-bold">
                  <strong>{post.title}</strong>
                </p>
                <p>{post.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
