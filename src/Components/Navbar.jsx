import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Userslice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "#0077cc",
      color: "white",
      alignItems: "center"
    }}>
      <div>
        <h3>Smart Campus</h3>
      </div>
      
      <div>
        <span style={{ marginRight: "20px" }}>
          Hello, {user?.name} ({user?.role})
        </span>
        <button onClick={handleLogout} style={{
          backgroundColor: "white",
          color: "#0077cc",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer",
          borderRadius: "4px"
        }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
