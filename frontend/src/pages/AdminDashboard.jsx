import { useNavigate, Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="max-w-60 mx-auto mt-10 p-6 bg-white rounded shadow">
        <h3 className="text-2xl font-bold mb-4">see all users</h3>
        <Link to="/user-list" className="text-blue-600 hover:underline">
          see all users
        </Link>
      </div>
      <div className="max-w-60 mx-auto mt-10 p-6 bg-white rounded shadow">
        <h3 className="text-2xl font-bold mb-4">see posts</h3>
        <Link to="/" className="text-blue-600 hover:underline">
          see posts
        </Link>
      </div>
    </>
  );
}

export default AdminDashboard;
