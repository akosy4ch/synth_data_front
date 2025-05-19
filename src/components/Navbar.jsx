import React from "react";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#00F260] via-[#45a247] via-[#2b5876] to-[#283c86] text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:opacity-90 transition"
        >
          SynthData Generator
        </Link>

        <div className="space-x-4 text-sm font-medium">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:underline hover:opacity-90 transition">Login</Link>
              <Link to="/register" className="hover:underline hover:opacity-90 transition">Register</Link>
            </>
          ) : (
            <>
              <Link to="/my-files" className="hover:underline hover:opacity-90 transition">
                📁 My Files
              </Link>
              <button
                onClick={handleLogout}
                className="bg-transparent border border-white rounded px-4 py-2 hover:bg-white hover:text-[#2b5876] transition duration-200"
              >
                Logout
              </button>
            </>
          )}

          <Link
            to="/evaluate"
            className="hover:underline hover:opacity-90 transition"
          >
            🧪 Evaluate Texts
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
