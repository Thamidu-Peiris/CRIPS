import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const Shop = () => {
  const [plants, setPlants] = useState([]);
  const [categories] = useState(["All", "Floating", "Submerged", "Emergent", "Marginal", "Mosses"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockedPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error("Error fetching stocked plants:", error);
      }
    };
    fetchStockedPlants();

    // Load LineIcons CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.lineicons.com/4.0/lineicons.css";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleAddToWishlist = (plant) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some((item) => item._id === plant._id)) {
      wishlist.push(plant);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    navigate("/wishlist");
  };

  const handleAddToCart = (plant) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.some((item) => item._id === plant._id)) {
      cart.push({ ...plant, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  const filteredPlants = plants.filter(
    (plant) =>
      plant.quantity > 0 &&
      (selectedCategory === "All" || plant.category === selectedCategory) &&
      (plant.plantName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPlants = filteredPlants.slice(0, 4);
  const latestPlants = filteredPlants
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="font-sans min-h-screen bg-gray-50">
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
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-green-700 font-bold text-lg hover:text-green-600 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/careers"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Hero Search and Filters */}
      <div className="bg-gradient-to-r from-green-100 to-teal-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-center text-green-800"
          >
            Discover Your Perfect Plant
          </motion.h1>
          <div className="relative w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border-2 border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-green-100 border border-gray-200"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Plants Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">Featured Plants</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
          {featuredPlants.length > 0 ? (
            featuredPlants.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                handleAddToCart={handleAddToCart}
                handleAddToWishlist={handleAddToWishlist}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No featured plants available.</p>
          )}
        </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">Latest Arrivals</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
          {latestPlants.length > 0 ? (
            latestPlants.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                handleAddToCart={handleAddToCart}
                handleAddToWishlist={handleAddToWishlist}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No new arrivals at the moment.</p>
          )}
        </div>
      </section>

      {/* All Plants Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">All Available Plants</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
          {filteredPlants.length > 0 ? (
            filteredPlants.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
                handleAddToCart={handleAddToCart}
                handleAddToWishlist={handleAddToWishlist}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No plants match your criteria.</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Reusable PlantCard Component
const PlantCard = ({ plant, handleAddToCart, handleAddToWishlist }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 group overflow-hidden"
  >
    <div className="relative">
      <Link to={`/plant/${plant._id}`}>
        <img
          src={plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg'}
          alt={plant.plantName}
          className="w-full h-64 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = 'http://localhost:5000/uploads/default-plant.jpg')}
        />
      </Link>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAddToCart(plant)}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-green-50 flex items-center justify-center w-12 h-12"
        >
          <i className="lni lni-cart text-green-600 text-xl"></i>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleAddToWishlist(plant)}
          className="bg-white p-3 rounded-full shadow-lg hover:bg-green-50 flex items-center justify-center w-12 h-12"
        >
          <i className="lni lni-heart text-green-600 text-xl"></i>
        </motion.button>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-semibold text-gray-800 truncate">{plant.plantName}</h3>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-base">★</span>
          ))}
        </div>
      </div>
      <p className="text-green-600 font-bold text-lg mt-2">${plant.itemPrice.toFixed(2)}</p>
    </div>
  </motion.div>
);

export default Shop;