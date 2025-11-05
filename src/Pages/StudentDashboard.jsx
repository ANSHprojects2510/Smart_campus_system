import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Userslice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    // Fetch all assignments
    const fetchAssignments = async () => {
      try {
        const token = user?.token; // get token
  
        const res = await axios.get("http://localhost:5000/api/assignments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err.response?.data || err);
      }
    };
  
    fetchAssignments();
  }, [user]);
  
    

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">Welcome, {user?.name}</h1>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </header>

      {/* Profile Card */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-bold">Profile</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      {/* Assignments List */}
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Assignments</h2>
        {assignments.length === 0 ? (
          <p>No assignments available</p>
        ) : (
          <ul className="space-y-2">
           {assignments.map((a) => (
  <li key={a._id} className="bg-gray-700 p-2 rounded">
    <strong>{a.title}</strong> ({a.course})
    <p>{a.description}</p>
  </li>
))}

          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;


