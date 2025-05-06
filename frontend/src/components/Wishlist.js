import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomerHeader from "./CustomerHeader";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleAddToCart = (plant) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.some((item) => item._id === plant._id)) {
      cart.push({ ...plant, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    navigate("/cart");
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/shop" className="text-green-700 font-bold text-lg hover:text-green-600 transition relative group">
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/careers" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/about" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/contact" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl font-bold text-green-900 mb-12 tracking-tight text-center">Your Wishlist</h2>
          
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-xl text-gray-600 mb-6"
              >
                Your wishlist is empty
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  to="/shop"
                  className="inline-block bg-green-200 text-green-800 px-8 py-4 rounded-full font-medium text-lg hover:bg-green-300 transition-all shadow-lg group"
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    Start Shopping
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 group overflow-hidden"
                >
                  <Link to={`/plant/${item._id}`}>
                    <img
                      src={item.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
                      alt={item.plantName}
                      className="w-full h-64 object-cover rounded-t-3xl group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.target.src = "http://localhost:5000/uploads/default-plant.jpg")}
                    />
                  </Link>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-green-900 truncate">{item.plantName}</h3>
                    <p className="text-green-600 font-bold text-lg mt-3">${item.itemPrice.toFixed(2)}</p>
                    <div className="mt-4 flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-green-800 transition-all shadow-md text-sm font-medium"
                      >
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const updatedWishlist = wishlist.filter((_, i) => i !== index);
                          setWishlist(updatedWishlist);
                          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                        }}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-red-800 transition-all shadow-md text-sm font-medium"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {wishlist.length > 0 && (
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                to="/shop"
                className="inline-block bg-green-200 text-green-800 px-8 py-4 rounded-full font-medium text-lg hover:bg-green-300 transition-all shadow-lg group"
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  Continue Shopping
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;