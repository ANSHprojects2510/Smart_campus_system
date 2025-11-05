import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Userslice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: email.trim(), password: password.trim() }
      );

      const user = res.data.user;

      if (user.role !== role) {
        alert(`User is not a ${role}`);
        return;
      }

      dispatch(setUser(user));

      if (role === "student") navigate("/student/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/admin/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        {
          token: credentialResponse.credential,
          role,
        }
      );

      const user = res.data.user;

      if (user.role !== role) {
        alert(`Google account not registered as ${role}`);
        return;
      }

      dispatch(setUser(user));

      if (role === "student") navigate("/student/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");
      else navigate("/admin/dashboard");

    } catch (err) {
      // If user hasn't registered yet, redirect to register page
      if (err.response?.status === 403) {
        alert(err.response.data.message || "Please register first.");
        navigate("/register"); // redirect user to register page
      } else {
        alert(err.response?.data?.message || "Google login failed");
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Smart Campus Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-semibold transition duration-300 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
          />
        </div>

        {/* ✅ New link for first-time users */}
        <p className="mt-4 text-gray-300 text-center">
          First time here?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

