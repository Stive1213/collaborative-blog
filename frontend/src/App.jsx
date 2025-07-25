import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyPage from "./pages/VerifyPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import UserList from "./pages/UserList";
import PostDetailPage from "./pages/PostDetailPage";
function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/post/:id"
            element={
              <PrivateRoute>
                <PostDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-list"
            element={
              <PrivateRoute requiredRole="admin">
                <UserList />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
