// frontend\src\components\Wishlist.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex flex-col md:flex-row justify-between items-center p-6 bg-white shadow-lg">
        <div className="text-xl font-bold flex items-center mb-4 md:mb-0">
          <img src="/logo.png" alt="Logo" className="h-12 mr-3" />
        </div>
        <div className="flex flex-wrap justify-center space-x-8 mb-4 md:mb-0">
          <Link to="/" className="text-green-600 font-semibold hover:text-green-700 transition duration-300">
            Home
          </Link>
          <Link to="/shop" className="text-gray-600 font-medium hover:text-green-600 transition duration-300">
            Shop
          </Link>
          <Link to="/careers" className="text-gray-600 font-medium hover:text-green-600 transition duration-300">
            Careers
          </Link>
          <Link to="/about" className="text-gray-600 font-medium hover:text-green-600 transition duration-300">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 font-medium hover:text-green-600 transition duration-300">
            Contact Us
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Your Wishlist</h2>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">Your wishlist is empty</p>
            <Link 
              to="/shop" 
              className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Link to={`/plant/${item._id}`}>
                  <img
                    src={item.plantImage}
                    alt={item.plantName}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.target.src = "/default-plant.jpg")}
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{item.plantName}</h3>
                  <p className="text-green-600 font-medium mt-1">${item.itemPrice}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition duration-300"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        const updatedWishlist = wishlist.filter((_, i) => i !== index);
                        setWishlist(updatedWishlist);
                        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                      }}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {wishlist.length > 0 && (
          <div className="mt-8 text-center">
            <Link 
              to="/shop" 
              className="text-green-600 font-medium hover:text-green-700 transition duration-300 underline"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;