import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { FiUser, FiSettings, FiLock, FiLogOut } from "react-icons/fi";

const SalesManagerNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const navigate = useNavigate();

  // Fetch user info from localStorage and update state
  const updateUserState = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFirstName(userInfo.firstName || "Manager");
      setLastName(userInfo.lastName || "");
      const imagePath = userInfo.profileImage
        ? `http://localhost:5000${userInfo.profileImage}`
        : "/default-profile.png";
      setProfileImage(imagePath);
    } else {
      setFirstName("Sales Manager");
      setLastName("");
      setProfileImage("/default-profile.png");
    }
  };

  useEffect(() => {
    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userInfoChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userInfoChanged", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowMenu(false);
    navigate("/login");
    window.dispatchEvent(new Event("userInfoChanged"));
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold text-green-600 font-sans">Welcome, Sales Manager</h1>

      {/* Right Section (Notification + Profile) */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="relative">
          <MdNotificationsNone className="text-gray-800 text-3xl" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          {/* Profile Button with Image */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 z-20"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 object-cover rounded-full"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
            <span className="text-gray-800 font-normal">{fullName}</span>
            <FaAngleDown className="text-sm" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
              <ul className="py-2">
                <li
                  onClick={() => navigate("/sales-manager-profile-settings")}
                  className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <FiUser className="mr-2" /> Profile
                </li>
                <li
                  onClick={() => navigate("/sales-manager-update-profile")}
                  className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <FiSettings className="mr-2" /> Update Profile
                </li>
                <li
                  onClick={() => navigate("/sales-manager-change-password")}
                  className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <FiLock className="mr-2" /> Change Password
                </li>
                <li
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
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

export default SalesManagerNavbar;