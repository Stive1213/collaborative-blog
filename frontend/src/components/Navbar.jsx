import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-200 text-black  p-4 flex justify-between rounded-lg shadow-lg hover:bg-gray-300">
      <Link to="/" className="font-bold text-xl">
        📝 BlogApp
      </Link>
      <div>
        {user ? (
          <>
            <span className="mr-4 font-bold rounded-lg shadow-lg">
              Hello, {user.name}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
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
