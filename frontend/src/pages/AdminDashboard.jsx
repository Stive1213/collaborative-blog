import { useNavigate, Link } from "react-router-dom";
import UserList from "./UserList";

function AdminDashboard() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="text-gray-700">Welcome, Admin! This is your dashboard.</p>
      <Link to="/user-list" className="text-blue-600 hover:underline">
        see all users
      </Link>
    </div>
  );
}

export default AdminDashboard;
