import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomerHeader from "./CustomerHeader";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.itemPrice, 0);

  const handleCheckout = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/customerregister");
    } else {
      navigate("/checkout");
    }
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

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl font-bold text-green-900 mb-12 tracking-tight text-center">Your Cart</h2>
          {cart.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-xl text-center mt-10"
            >
              Your cart is empty
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={item.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
                      alt={item.plantName}
                      className="w-32 h-32 object-cover rounded-xl mr-6 hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = "http://localhost:5000/uploads/default-plant.jpg")}
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-green-900">{item.plantName}</h3>
                      <p className="text-gray-600 text-lg mt-1">
                        ${item.itemPrice.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-green-600 font-bold text-xl mt-2">
                        ${(item.itemPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-red-800 transition-all shadow-md"
                      onClick={() => {
                        const updatedCart = cart.filter((_, i) => i !== index);
                        setCart(updatedCart);
                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                      }}
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg h-fit"
              >
                <h3 className="text-2xl font-bold text-green-900 mb-6">Order Summary</h3>
                <div className="space-y-4 text-lg">
                  <p className="flex justify-between text-gray-700">
                    <span>Total Cost:</span>
                    <span className="font-medium">${totalCost.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between text-green-900 font-semibold border-t pt-4">
                    <span>Total:</span>
                    <span className="font-bold text-xl">${totalCost.toFixed(2)}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-4 rounded-full hover:from-green-600 hover:to-green-800 transition-all font-medium shadow-lg"
                >
                  Continue to Checkout
                </motion.button>
              </motion.div>
            </div>
          )}
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
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;