import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect away from login page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

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
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
