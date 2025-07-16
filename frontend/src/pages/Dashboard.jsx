import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Role: {user.role}</p>
        </>
      ) : (
        <h1 className="text-xl text-gray-700">Please log in to view your dashboard.</h1>
      )}
    </div>
  );
}

export default Dashboard;
