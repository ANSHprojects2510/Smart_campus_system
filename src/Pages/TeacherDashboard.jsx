import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Userslice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments", { withCredentials: true });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/assignments",
        { title, course, description },
        { withCredentials: true }
      );
      setTitle("");
      setCourse("");
      setDescription("");
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex">
      <aside className="w-64 bg-gray-800 p-4 rounded shadow mr-6">
        <h2 className="text-xl font-bold mb-4">Teacher Menu</h2>
        <button onClick={handleLogout} className="bg-red-500 w-full py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </aside>

      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Assignments</h1>

        <form onSubmit={handleCreate} className="bg-gray-800 p-4 rounded mb-6 shadow space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-700"
          />
          <button type="submit" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
            Create Assignment
          </button>
        </form>

        <div>
          {assignments.map((a) => (
            <div key={a._id} className="bg-gray-700 p-3 rounded mb-2">
              <strong>{a.title}</strong> ({a.course})
              <p>{a.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;



