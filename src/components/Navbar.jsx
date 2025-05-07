import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Очищаем токен
    navigate("/login"); // Переходим на страницу логина
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#4CAF50",
      padding: "1rem",
      color: "white"
    }}>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold"
        }}
      >
        SynthData Generator
      </Link>

      <div>
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              style={{ marginRight: "1rem", textDecoration: "none", color: "white" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "white" }}
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid white",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
