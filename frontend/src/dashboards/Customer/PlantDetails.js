import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import CustomerHeader from "../../components/CustomerHeader";
import { motion } from "framer-motion";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [popularPlants, setPopularPlants] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/plantstock/plant/${id}`);
        setPlant(response.data);
      } catch (error) {
        console.error("Failed to fetch plant details:", error);
      }
    };
    fetchPlantDetails();
  }, [id]);

  useEffect(() => {
    const fetchPopularPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Popular plants API response:", data); // Debug log
        const stocksData = data.stocks || [];
        if (!Array.isArray(stocksData)) {
          console.error("Expected an array for stocks, received:", stocksData);
          setPopularPlants([]);
          return;
        }
        const sortedPlants = stocksData
          .filter((p) => p.quantity > 0 && p._id !== id)
          .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
          .slice(0, 4);
        setPopularPlants(sortedPlants);
      } catch (error) {
        console.error("Error fetching popular plants:", error);
        setPopularPlants([]);
      }
    };
    fetchPopularPlants();
  }, [id]);

  const handleAddToCart = (selectedPlant = plant) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === selectedPlant._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...selectedPlant, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowPopup(true);
  };

  const handleAddToWishlist = (selectedPlant = plant) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some((item) => item._id === selectedPlant._id)) {
      wishlist.push(selectedPlant);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    navigate("/wishlist");
  };

  if (!plant) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-2xl font-semibold text-green-600"
      >
        Loading...
      </motion.div>
    </div>
  );

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

      {/* Plant Details Content */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-12"
        >
          {/* Left Side: Image */}
          <div className="md:w-1/2 relative">
            <img
              src={plant.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
              alt={plant.plantName}
              className="w-full h-[500px] object-cover rounded-3xl shadow-lg hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => (e.target.src = "http://localhost:5000/uploads/default-plant.jpg")}
            />
            <motion.div
              className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md rounded-full p-3"
              whileHover={{ scale: 1.2 }}
            >
              <FaHeart className="text-red-500 text-2xl cursor-pointer" onClick={() => handleAddToWishlist(plant)} />
            </motion.div>
          </div>

          {/* Right Side: Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-5xl font-bold text-green-900 mb-4 tracking-tight">{plant.plantName}</h1>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-yellow-400 text-xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <div className="space-y-5 text-gray-700 text-lg">
                <p><strong className="text-green-900">Category:</strong> {plant.category || "N/A"}</p>
                <p><strong className="text-green-900">Description:</strong> {plant.description || "No description available."}</p>
                <p><strong className="text-green-900">Available Quantity:</strong> {plant.quantity} units</p>
                <p><strong className="text-green-900">Item Price:</strong> <span className="text-green-600 font-bold text-2xl">${plant.itemPrice.toFixed(2)}</span></p>
                <p><strong className="text-green-900">Expiration Date:</strong> {new Date(plant.expirationDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-10">
              <div className="flex items-center gap-6 mb-8">
                <label className="text-green-900 font-medium text-lg">Quantity:</label>
                <div className="flex items-center gap-4 bg-green-50 p-3 rounded-full">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-green-600 hover:text-green-800 transition-colors rounded-full bg-white shadow-sm"
                  >
                    <FaMinus />
                  </motion.button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(plant.quantity, parseInt(e.target.value || 1))))}
                    className="w-16 text-center bg-transparent text-green-900 font-medium text-lg focus:outline-none"
                    min="1"
                    max={plant.quantity}
                  />
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setQuantity(Math.min(plant.quantity, quantity + 1))}
                    className="p-2 text-green-600 hover:text-green-800 transition-colors rounded-full bg-white shadow-sm"
                  >
                    <FaPlus />
                  </motion.button>
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(plant)}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-4 rounded-full hover:from-green-600 hover:to-green-800 transition-all shadow-lg"
                >
                  <FaShoppingCart /> Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToWishlist(plant)}
                  className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-red-800 transition-all shadow-lg"
                >
                  <FaHeart /> Add to Wishlist
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl text-center max-w-md">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-green-600 text-6xl mb-6"
            >
              ✔
            </motion.div>
            <p className="text-2xl font-semibold text-green-900 mb-8">Added to your cart!</p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowPopup(false);
                  navigate("/cart");
                }}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-800 transition-all"
              >
                View Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowPopup(false);
                  navigate("/checkout");
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all"
              >
                Checkout
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Popular Plants Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <h2 className="text-4xl font-bold text-center text-green-900 mb-12 tracking-tight">Explore More Plants</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
          {popularPlants.length > 0 ? (
            popularPlants.map((popularPlant) => (
              <motion.div
                key={popularPlant._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-500 group overflow-hidden"
              >
                <Link to={`/plant/${popularPlant._id}`}>
                  <img
                    src={popularPlant.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
                    alt={popularPlant.plantName}
                    className="w-full h-64 object-cover rounded-t-3xl group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.target.src = "http://localhost:5000/uploads/default-plant.jpg")}
                  />
                </Link>
                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleAddToCart(popularPlant)}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-green-100"
                  >
                    <FaShoppingCart className="text-green-600 text-xl" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleAddToWishlist(popularPlant)}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-red-100"
                  >
                    <FaHeart className="text-red-500 text-xl" />
                  </motion.button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-900 truncate">{popularPlant.plantName}</h3>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base">★</span>
                    ))}
                  </div>
                  <p className="text-green-600 font-bold text-lg mt-3">${popularPlant.itemPrice.toFixed(2)}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-lg">No popular plants available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlantDetails;