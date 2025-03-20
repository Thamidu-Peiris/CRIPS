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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const updateUserState = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      const imagePath = userInfo.profileImage
        ? `http://localhost:5000${userInfo.profileImage}`
        : "/default-profile.png";
      setProfileImage(imagePath);
      setIsLoggedIn(true);
    } else {
      setFirstName("");
      setLastName("");
      setProfileImage("/default-profile.png");
      setIsLoggedIn(false);
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  };

  useEffect(() => {
    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);

    const handleCustomStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("userInfoChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userInfoChanged", handleCustomStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setFirstName("");
    setLastName("");
    setProfileImage("/default-profile.png");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("userInfoChanged"));
  };

  const toggleDropdown = () => {
    console.log("Toggling dropdown, current state:", dropdownOpen);
    setDropdownOpen(!dropdownOpen);
  };

  const handleCartClick = (e) => {
    console.log("Cart link clicked");
  };

  const handleWishlistClick = (e) => {
    console.log("Wishlist link clicked");
  };

  const handleProfileSettingsClick = (e) => {
    console.log("Profile Settings link clicked");
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="flex items-center space-x-6">
      {isLoggedIn ? (
        <>
          <Link
            to="/cart"
            onClick={handleCartClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 relative"
          >
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

          <Link
            to="/wishlist"
            onClick={handleWishlistClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <img
              src="/home/wishlist-icon.png"
              alt="Wishlist"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium">Wishlist</span>
          </Link>

          <div className="relative">
            <button
              onClick={toggleDropdown}
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
              <span className="text-sm font-medium">{fullName}</span>
              <FaAngleDown className="text-sm" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50">
                <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <img
                    src="/home/profile-icon.png"
                    alt="Profile Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
                  Profile
                </Link>
                <Link to="/dashboard/orders" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <img
                    src="/home/orders-icon.png"
                    alt="Orders Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
                  Orders
                </Link>
                <Link to="/dashboard/tracking" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <img
                    src="/home/tracking-icon.png"
                    alt="Tracking Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
                  Tracking
                </Link>
                <Link to="/dashboard/support" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <img
                    src="/home/support-icon.png"
                    alt="Support Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
                  Support
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={handleProfileSettingsClick}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <img
                    src="/home/settings-icon.png"
                    alt="Settings Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left"
                >
                  <img
                    src="/home/logout-icon.png"
                    alt="Logout Icon"
                    className="w-5 h-5 object-contain mr-2"
                  />
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
          <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerHeader;