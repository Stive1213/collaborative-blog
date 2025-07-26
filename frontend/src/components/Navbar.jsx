import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-gray-200 text-black p-4 flex justify-between items-center rounded-lg shadow-lg hover:bg-gray-300">
      <Link to="/" className="font-bold text-xl">
        📝 BlogApp
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Avatar circle with initial */}
            <Link
              to={`/my-profile`}
              className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold shadow-md hover:scale-105 transition"
              title="My Profile"
            >
              {getInitial(user.name)}
            </Link>

            {/* Greeting */}
            <span className="font-semibold">Hello, {user.name}</span>

            {/* Logout button */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
