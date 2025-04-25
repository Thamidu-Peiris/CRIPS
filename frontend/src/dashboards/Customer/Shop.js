// frontend\src\dashboards\Customer\Shop.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";
import { FaSearch, FaHeart, FaShoppingCart } from "react-icons/fa";

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

  return (
    <div className="font-sans min-h-screen bg-white">
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-green-600 font-bold">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        <CustomerHeader />
      </nav>

      <div className="bg-gray-100 py-4 px-5">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="relative w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${selectedCategory === category ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-green-100"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-10">
        <h2 className="text-center text-3xl font-bold text-green-700 mb-6">Available Plants</h2>
        <div className="flex justify-center p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <div
                  key={plant._id}
                  className="relative border rounded-lg p-3 shadow-lg text-center bg-white group hover:shadow-xl"
                >
                  <Link to={`/plant/${plant._id}`}>
                    <img
                      src={plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg'}
                      alt={plant.plantName}
                      className="w-full h-60 object-cover rounded-md"
                    />
                  </Link>
                  <h3 className="text-md font-bold mt-3 text-green-700">{plant.plantName}</h3>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gray-300 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-green-600 font-semibold mt-1">${plant.itemPrice.toFixed(2)}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaShoppingCart
                      className="text-green-600 text-2xl cursor-pointer mb-2"
                      onClick={() => handleAddToCart(plant)}
                    />
                    <FaHeart
                      className="text-red-500 text-2xl cursor-pointer"
                      onClick={() => handleAddToWishlist(plant)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No plants match your criteria.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;