import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    // Save user to localStorage (simulate DB)
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.username === username)) {
      setError("Username already exists");
      return;
    }
    const newUser = { username, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setError("");
    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Sign Up</button>
      </form>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 underline">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
