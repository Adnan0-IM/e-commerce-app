import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state, if available
  const from = location.state?.from || "/";

  // If already logged in, redirect based on context
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Check localStorage first (for signup users)
      const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = localUsers.find(
        (u: any) => u.username === username && u.password === password
      );

      if (user) {
        login(user.username, user.role as "user" | "admin");
        return;
      }

      // Fallback to static users.json (for demo)
      const staticUsers = [
        { username: "user", password: "userpass", role: "user" },
        { username: "admin", password: "adminpass", role: "admin" },
      ];

      const staticUser = staticUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (staticUser) {
        login(staticUser.username, staticUser.role as "user" | "admin");
        return;
      }

      setError("Invalid username or password");
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              New to our platform?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/signup"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
