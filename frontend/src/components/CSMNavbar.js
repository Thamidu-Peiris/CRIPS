// frontend\src\components\CSMNavbar.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import { FiUser, FiSettings, FiLock, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [alertQueue, setAlertQueue] = useState([]); // Queue for alert messages
  const [currentAlert, setCurrentAlert] = useState(null); // Current alert message
  const [isLoading, setIsLoading] = useState(false); // Loading state for "Checking for updates..."
  const [isFetching, setIsFetching] = useState(false); // Track API fetch state
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/csm/dashboard";
  const hasPlayedConfetti = useRef(false); // Track if confetti has played
  const alertTimeoutRef = useRef(null); // Store timeout ID

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

  // Poll for new pending items (orders, customers, tickets)
  const checkForNewItems = async () => {
    try {
      setIsLoading(true); // Show "Checking for updates..."
      setIsFetching(true); // Track API fetch
      console.log("Checking for new pending items...");
      // Fetch all APIs concurrently
      const [ordersResponse, customersResponse, ticketsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/orders"),
        axios.get("http://localhost:5000/api/csm/customers/pending"),
        axios.get("http://localhost:5000/api/support"),
      ]);

      // Filter pending items
      const pendingOrders = ordersResponse.data.filter(
        (order) => order.status && order.status.toLowerCase() === "pending"
      );
      const pendingCustomers = customersResponse.data;

      // Log raw tickets response and unique status values for debugging
      console.log("Raw /api/support response:", ticketsResponse.data);
      const ticketStatuses = [...new Set(ticketsResponse.data.map((ticket) => ticket.status || "undefined"))];
      console.log("Unique ticket statuses:", ticketStatuses);

      // Log tickets that fail the status filter
      const nonPendingTickets = ticketsResponse.data.filter(
        (ticket) => !ticket.status || !["pending", "open", "new", "unresolved", "active", "waiting", "in_progress", "on_hold", "created"].includes(ticket.status?.toLowerCase())
      );
      console.log("Non-pending tickets (failed status filter):", nonPendingTickets);

      // Filter pending tickets (check multiple status variations)
      const pendingTickets = ticketsResponse.data.filter(
        (ticket) => ticket.status && ["pending", "open", "new", "unresolved", "active", "waiting", "in_progress", "on_hold", "created"].includes(ticket.status.toLowerCase())
      );

      // Log counts for debugging
      console.log("Pending Orders:", pendingOrders.length);
      console.log("Pending Customers:", pendingCustomers.length);
      console.log("Pending Tickets:", pendingTickets.length);

      // Build alert messages for pending items with counts
      const newAlerts = [];
      if (pendingCustomers.length > 0) {
        newAlerts.push(`${pendingCustomers.length} Pending Customer Request(s) Received`);
      }
      if (pendingOrders.length > 0) {
        newAlerts.push(`${pendingOrders.length} New Pending Order(s) Received`);
      }
      if (pendingTickets.length > 0) {
        newAlerts.push(`${pendingTickets.length} New Pending Ticket(s) Received`);
      }

      // Log queued alerts
      console.log("New Alerts Queued:", newAlerts);

      // Update alert queue if new items are found
      if (newAlerts.length > 0) {
        setAlertQueue((prev) => {
          const updatedQueue = [...prev, ...newAlerts.filter((alert) => !prev.includes(alert))];
          console.log("Updated Alert Queue:", updatedQueue);
          return updatedQueue;
        });
      }
    } catch (error) {
      console.error("Error checking for new items:", error);
    } finally {
      setIsFetching(false); // API fetch complete
    }
  };

  // Handle confetti on initial dashboard load
  useEffect(() => {
    if (isDashboard && !hasPlayedConfetti.current) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.2 },
        colors: ["#4CAF50", "#2196F3", "#FFC107", "#ff718d", "#a864fd" ],
      });
      hasPlayedConfetti.current = true; // Mark confetti as played
    }
    if (!isDashboard) {
      hasPlayedConfetti.current = false; // Reset for next dashboard visit
      setIsLoading(false); // Reset loading state to avoid stuck "Checking for updates..."
    }
  }, [isDashboard]);

  // Handle user state and polling
  useEffect(() => {
    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userInfoChanged", handleStorageChange);

    // Delay initial alert check by 5 seconds
    const initialCheckTimeout = setTimeout(() => {
      checkForNewItems();
      // Start polling every 22 seconds after initial check
      const pollInterval = setInterval(checkForNewItems, 22000);
      return () => clearInterval(pollInterval);
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userInfoChanged", handleStorageChange);
      clearTimeout(initialCheckTimeout);
    };
  }, []);

  // Control "Checking for updates..." display for exactly 4 seconds
  useEffect(() => {
    let loadingTimeout;
    if (isLoading) {
      loadingTimeout = setTimeout(() => {
        setIsLoading(false); // Hide "Checking for updates..." after 4 seconds
      }, 4000);
    }
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [isLoading]);

  // Handle alert display, cycling, and hiding
  useEffect(() => {
    if (alertQueue.length > 0 && !currentAlert && !isLoading) {
      console.log("Displaying alert:", alertQueue[0]);
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prev) => prev.slice(1));
    }

    if (currentAlert) {
      console.log("Starting 3-second timer for alert:", currentAlert);
      alertTimeoutRef.current = setTimeout(() => {
        console.log("Hiding alert:", currentAlert);
        setCurrentAlert(null);
        alertTimeoutRef.current = null;
      }, 3000); // Display for 3 seconds
    }

    return () => {
      if (alertTimeoutRef.current) {
        console.log("Clearing timeout on cleanup:", currentAlert);
        clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = null;
      }
    };
  }, [alertQueue, currentAlert, isLoading]);

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
  const defaultTitle = isManageOrders
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
  const title = currentAlert || (isLoading ? "Checking for updates..." : defaultTitle);

  // Animation variants for navbar background and text color
  const navbarVariants = {
    normal: {
      backgroundColor: "#ffffff",
      color: "#16a34a", // green-600 for title
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    alert: {
      backgroundColor: "#000000",
      color: "#ffffff",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for notification bell shake
  const bellVariants = {
    idle: { rotate: 0 },
    shake: {
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex justify-between items-center p-4 shadow-md border-4 border-transparent"
      style={{ borderRadius: "9999px" }} // Fully rounded rectangle
      variants={navbarVariants}
      animate={currentAlert ? "alert" : "normal"}
    >
      <style>
        {`
          .animate-rainbow-text {
            background: linear-gradient(
              to right,
              #ff0000,
              #ff9900,
              #33cc33,
              #3399ff,
              #cc33cc,
              #ff0000
            );
            background-size: 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: rainbowMove 3s linear infinite;
          }
          @keyframes rainbowMove {
            0% {
              background-position: 0%;
            }
            100% {
              background-position: 200%;
            }
          }
        `}
      </style>
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
              className={`text-2xl font-bold font-sans ${isLoading && title === "Checking for updates..." ? "animate-rainbow-text" : ""}`}
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
                <motion.div
                  variants={bellVariants}
                  animate={currentAlert ? "shake" : "idle"}
                >
                  <MdNotificationsNone
                    className="text-3xl"
                    style={{ color: currentAlert ? "#ffffff" : "#1f2937" }}
                  />
                </motion.div>
              </button>
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 z-20"
                  style={{ color: "#000000" }} // Always black
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
                    <ul className={`py-2 ${currentAlert ? "text-white bg-gray-800" : "text-black"}`}>
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
            <h1 className="text-2xl font-bold font-sans">
              {title}
            </h1>

            {/* Right Section (Notification + Profile) */}
            <div className="flex items-center space-x-6">
              {/* Notification Icon */}
              <button className="relative">
                <motion.div
                  variants={bellVariants}
                  animate={currentAlert ? "shake" : "idle"}
                >
                  <MdNotificationsNone
                    className="text-3xl"
                    style={{ color: currentAlert ? "#ffffff" : "#1f2937" }}
                  />
                </motion.div>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 z-20"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-8 h-8 object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = "/default-profile.png";
                    }}
                  />
                  <span className="text-gray-600 hover:text-gray-800 font-normal">{fullName}</span>
                  <FaAngleDown className="text-sm" style={{ color: "#000000" }} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    <ul className="py-2 text-black">
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
    </motion.div>
  );
};

export default Navbar;