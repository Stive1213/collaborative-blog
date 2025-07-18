import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="text-gray-600">Role: {user.role}</p>

      {user.role === "admin" && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <p>You can manage all posts and users.</p>
        </div>
      )}

      {user.role === "user" && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <h2 className="text-lg font-semibold">Author Dashboard</h2>
          <p>You can write and edit your own posts.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
