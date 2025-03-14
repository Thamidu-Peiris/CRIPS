import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiUser, FiSettings, FiLock, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/employee-login");
  };

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Welcome, CS Manager</h1>

      {/* Right Section (Notification + Profile) */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="relative">
          <MdNotificationsNone className="text-gray-800 text-3xl" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          {/* Profile Button */}
          <button onClick={() => setShowMenu(!showMenu)} className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-800 text-3xl" />
            <span className="text-gray-800 font-semibold">Manager</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
              <ul className="py-2">
                <li onClick={() => navigate("/profile-settings")} className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <FiUser className="mr-2" /> Profile
                </li>
                <li onClick={() => navigate("/update-profile")} className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <FiSettings className="mr-2" /> Update Profile
                </li>
                <li onClick={() => navigate("/change-password")} className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <FiLock className="mr-2" /> Change Password
                </li>
                <li onClick={handleLogout} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer">
                  <FiLogOut className="mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
