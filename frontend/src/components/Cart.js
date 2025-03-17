//CRIPS\frontend\src\components\Cart.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/staff" className="text-gray-600">Staff</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* Cart & Profile */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart">
            <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
            >
              <span className="mr-2">{username}</span>
              <FaUserCircle className="text-gray-600 text-xl" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-10">
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">Shop</Link>
                <Link to="/dashboard/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/dashboard/tracking" className="block px-4 py-2 hover:bg-gray-100">Tracking</Link>
                <Link to="/dashboard/support" className="block px-4 py-2 hover:bg-gray-100">Support</Link>
                <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button onClick={handleLogout} className="block px-4 py-2 hover:bg-red-100 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Section */}
      <div className="p-6">
        <h2 className="text-3xl font-bold">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="mt-4">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-lg text-center w-60 h-80 flex flex-col items-center justify-between bg-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-md font-bold mt-2">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                  onClick={() => {
                    const updatedCart = cart.filter((_, i) => i !== index);
                    setCart(updatedCart);
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <Link to="/shop" className="mt-4 inline-block text-green-600">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
