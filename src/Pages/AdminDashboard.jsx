import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Userslice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menu = [
    "Dashboard Overview",
    "Manage Students",
    "Manage Teachers",
    "Manage Courses",
    "Assign Roles",
    "System Settings",
    "Announcements",
  ];

  const stats = [
    { label: "Total Students", value: 312 },
    { label: "Total Teachers", value: 24 },
    { label: "Active Courses", value: 18 },
    { label: "Pending Requests", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-500">Smart Campus Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{user?.name} ({user?.email})</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 border-r border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-purple-400">Admin Panel</h2>
          <ul className="space-y-4">
            {menu.map((item, i) => (
              <li
                key={i}
                className="cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Quick Stats + Profile */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">My Profile</h3>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>

            {/* Stats Cards */}
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition transform"
              >
                <p className="text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Recent System Activity</h2>
            <ul className="space-y-3 text-gray-300">
              <li>✔ Added new Student - Rahul Gupta</li>
              <li>✔ Created new Course - Data Structures</li>
              <li>⚙️ Updated Teacher Access Rights</li>
              <li>📢 Posted Announcement: Exam Schedule</li>
              <li>🗂 Approved 8 student registration requests</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


