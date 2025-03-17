//CRIPS\frontend\src\components\Layout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Layout = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
  };

  return (
    <div className="font-sans">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          {userInfo && (
            <Link to="/cart">
              <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
            </Link>
          )}

          {/* Profile Dropdown */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
              >
                <span className="mr-2">{userInfo.username}</span>
                <FaUserCircle className="text-gray-600 text-xl" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50">
                  <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">Shop</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                  <Link to="/dashboard/tracking" className="block px-4 py-2 hover:bg-gray-100">Tracking</Link>
                  <Link to="/dashboard/support" className="block px-4 py-2 hover:bg-gray-100">Support</Link>
                  <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <button onClick={handleLogout} className="block px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/customerregister" className="border px-4 py-2 rounded text-green-600">
                Sign Up
              </Link>
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
