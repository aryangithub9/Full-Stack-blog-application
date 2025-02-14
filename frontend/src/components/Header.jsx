import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Header() {
  const navigate = useNavigate();
  const { setUserInfo, UserInfo } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:8000/profile", { withCredentials: true })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userInfo");
      setUserInfo(null); // Clear user info
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const email = UserInfo?.email;

  return (
    <header className="bg-black text-white px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-lg md:text-2xl font-bold hover:text-gray-300">
        Blogify
      </Link>
      <nav className="space-x-4">
        {email ? (
          <>
            <Link
              to="/create"
              className=" text-sm md:text-lg bg-green-500 py-1 px-3 rounded-sm hover:bg-green-600 transition duration-300"
            >
              New Post
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm md:text-lg bg-red-500 py-1 px-3 rounded-sm hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg hover:text-gray-300 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-lg hover:text-gray-300 transition duration-300"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
