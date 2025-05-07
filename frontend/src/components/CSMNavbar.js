// frontend\src\components\CSMNavbar.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { FiUser, FiSettings, FiLock, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const navigate = useNavigate();
  const location = useLocation();

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
      setFirstName("Manager");
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

    // Trigger confetti on dashboard load
    if (location.pathname === "/csm/dashboard") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.1 },
        colors: ["#4CAF50", "#2196F3", "#FFC107"],
      });
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userInfoChanged", handleStorageChange);
    };
  }, [location.pathname]);

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

  // Determine navbar title and layout based on route
  const isDashboard = location.pathname === "/csm/dashboard";
  const isManageOrders = location.pathname === "/csm/manage-orders";
  const isTrackOrder = location.pathname === "/csm/track-order";
  const isKnowledgeBase = location.pathname === "/csm/knowledge-base";
  const isSupportTickets = location.pathname === "/csm/support-tickets";
  const isCustomersList = location.pathname === "/csm/customers-list";
  const isCustomerRequests = location.pathname === "/csm/customer-requests";
  const isCoupons = location.pathname === "/csm/coupons";
  const isProfileSettings = location.pathname === "/profile-settings";
  const isUpdateProfile = location.pathname === "/update-profile";
  const isChangePassword = location.pathname === "/change-password";
  const isConversation = location.pathname.startsWith("/dashboard/conversation/");
  const isCustomerDetails = location.pathname.startsWith("/customer/");
  const title = isDashboard
    ? "Welcome, CS Manager"
    : isManageOrders
    ? "Manage Orders"
    : isTrackOrder
    ? "Track Order"
    : isKnowledgeBase
    ? "Manage Knowledge Base"
    : isSupportTickets
    ? "Manage Support Tickets"
    : isCustomersList
    ? "Approved Customers List"
    : isCustomerRequests
    ? "Customer Approval Requests"
    : isCoupons
    ? "Manage Coupons"
    : isProfileSettings
    ? "CSM Profile"
    : isUpdateProfile
    ? "Update Profile"
    : isChangePassword
    ? "Change Password"
    : isConversation
    ? "Conversation"
    : isCustomerDetails
    ? "Customer Details"
    : "Welcome, CS Manager";

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-2xl">
      <AnimatePresence>
        {isDashboard || isManageOrders || isTrackOrder || isKnowledgeBase || isSupportTickets || isCustomersList || isCustomerRequests || isCoupons || isProfileSettings || isUpdateProfile || isChangePassword || isConversation || isCustomerDetails ? (
          <motion.div
            key="special-route"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center w-full relative"
          >
            <motion.h1
              className="text-2xl font-bold text-green-600 font-sans"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h1>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 flex items-center space-x-6"
            >
              {/* Notification Icon */}
              <button className="relative">
                <MdNotificationsNone className="text-gray-800 text-3xl" />
              </button>
              {/* Profile Dropdown */}
              <div className="relative">
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
                  <FaAngleDown className="text-sm" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <ul className="py-2">
                      <li
                        onClick={() => navigate("/profile-settings")}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <FiUser className="mr-2" /> Profile
                      </li>
                      <li
                        onClick={() => navigate("/update-profile")}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <FiSettings className="mr-2" /> Update Profile
                      </li>
                      <li
                        onClick={() => navigate("/change-password")}
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
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="navbar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center w-full"
          >
            <h1 className="text-2xl font-bold text-green-600 font-sans">
              Welcome, CS Manager
            </h1>

            {/* Right Section (Notification + Profile) */}
            <div className="flex items-center space-x-6">
              {/* Notification Icon */}
              <button className="relative">
                <MdNotificationsNone className="text-gray-800 text-3xl" />
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
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

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <ul className="py-2">
                      <li
                        onClick={() => navigate("/profile-settings")}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <FiUser className="mr-2" /> Profile
                      </li>
                      <li
                        onClick={() => navigate("/update-profile")}
                        className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <FiSettings className="mr-2" /> Update Profile
                      </li>
                      <li
                        onClick={() => navigate("/change-password")}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;