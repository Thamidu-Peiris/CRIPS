// CRIPS\frontend\src\components\CustomerHeader.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

const CustomerHeader = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  // Fetch user info and cart on mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFirstName(userInfo.firstName || "Guest");
      setLastName(userInfo.lastName || "");
      const imagePath = userInfo.profileImage
        ? `http://localhost:5000${userInfo.profileImage}`
        : "/default-profile.png";
      setProfileImage(imagePath);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setFirstName("");
    setLastName("");
    setProfileImage("/default-profile.png");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Combine first and last name for display
  const fullName = `${firstName} ${lastName}`.trim() || "Guest";

  return (
    <div className="flex items-center space-x-6">
      {isLoggedIn ? (
        <>
          {/* Cart with Custom Image */}
          <Link to="/cart" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 relative">
            <img
              src="/home/cart-icon.png"
              alt="Cart"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Wishlist with Custom Image */}
          <Link to="/wishlist" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <img
              src="/home/wishlist-icon.png"
              alt="Wishlist"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium">Wishlist</span>
          </Link>

          {/* Profile Section with Round Image and Down Arrow */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 object-cover rounded-full"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <span className="text-sm font-medium">{fullName}</span>
              <FaAngleDown className="text-sm" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-10">
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/dashboard/tracking" className="block px-4 py-2 hover:bg-gray-100">Tracking</Link>
                <Link to="/dashboard/support" className="block px-4 py-2 hover:bg-gray-100">Support</Link>
                <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
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
  );
};

export default CustomerHeader;