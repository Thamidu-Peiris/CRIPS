// frontend\src\components\CustomerHeader.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDown } from 'react-icons/fa';

const CustomerHeader = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const updateUserState = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setFirstName(userInfo.firstName || '');
      setLastName(userInfo.lastName || '');
      const imagePath = userInfo.profileImage
        ? `http://localhost:5000${userInfo.profileImage}`
        : '/default-profile.png';
      setProfileImage(imagePath);
      setIsLoggedIn(true);
    } else {
      setFirstName('');
      setLastName('');
      setProfileImage('/default-profile.png');
      setIsLoggedIn(false);
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  };

  useEffect(() => {
    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userInfoChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userInfoChanged', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
    setFirstName('');
    setLastName('');
    setProfileImage('/default-profile.png');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
    window.dispatchEvent(new Event('userInfoChanged'));
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="flex items-center space-x-4 md:space-x-6">
      {isLoggedIn ? (
        <>
          {/* Cart Link */}
          <Link
            to="/cart"
            className="flex items-center space-x-2 text-black hover:text-gray-700 relative transition duration-300"
          >
            <img
              src="/home/cart-icon.png"
              alt="Cart"
              className="w-6 h-6 object-contain"
              onError={(e) => (e.target.src = '/default-cart.png')}
            />
            <span className="text-sm font-medium hidden md:inline">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="flex items-center space-x-2 text-black hover:text-gray-700 transition duration-300"
          >
            <img
              src="/home/wishlist-icon.png"
              alt="Wishlist"
              className="w-6 h-6 object-contain"
              onError={(e) => (e.target.src = '/default-wishlist.png')}
            />
            <span className="text-sm font-medium hidden md:inline">Wishlist</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-black hover:text-gray-700 z-20 transition duration-300"
              aria-expanded={dropdownOpen}
              aria-controls="profile-dropdown"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 object-cover rounded-full"
                onError={(e) => (e.target.src = '/default-profile.png')}
              />
              <span className="text-sm font-medium hidden md:inline">{fullName}</span>
              <FaAngleDown className="text-sm" />
            </button>
            {dropdownOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50 border border-gray-200"
              >
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  <img
                    src="/home/profile-icon.png"
                    alt="Profile Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-profile-icon.png')}
                  />
                  Profile
                </Link>
                <Link
                  to="/dashboard/orders"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  <img
                    src="/home/orders-icon.png"
                    alt="Orders Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-orders-icon.png')}
                  />
                  Orders
                </Link>
                <Link
                  to="/dashboard/tracking"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  <img
                    src="/home/tracking-icon.png"
                    alt="Tracking Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-tracking-icon.png')}
                  />
                  Tracking
                </Link>
                <Link
                  to="/dashboard/support"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  <img
                    src="/home/support-icon.png"
                    alt="Support Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-support-icon.png')}
                  />
                  Support
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  <img
                    src="/home/settings-icon.png"
                    alt="Settings Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-settings-icon.png')}
                  />
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left transition duration-300"
                >
                  <img
                    src="/home/logout-icon.png"
                    alt="Logout Icon"
                    className="w-5 h-5 object-contain mr-2"
                    onError={(e) => (e.target.src = '/default-logout-icon.png')}
                  />
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex space-x-3">
          <Link
            to="/customerregister"
            className="border border-green-500 text-green-500 px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-green-500 hover:text-white transition duration-300"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerHeader;