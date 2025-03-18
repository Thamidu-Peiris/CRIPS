//CRIPS\frontend\src\dashboards\Customer\Shop.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";

const Shop = () => {
  const [plants, setPlants] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories] = useState(["All", "Aquatic", "Flowering", "Green"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/api/plants");
        console.log("API Response:", response.data);
        // Ensure data is an array
        if (Array.isArray(response.data)) {
          setPlants(response.data);
        } else {
          setPlants([]);
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching plants:", error);
        setError("Failed to load plants. Please try again later.");
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    return (
      <div className="flex justify-center space-x-1 mt-1">
        {Array.from({ length: totalStars }, (_, index) => (
          index < filledStars ? (
            <FaStar key={index} className="text-yellow-500" />
          ) : (
            <FaRegStar key={index} className="text-gray-400" />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10">Loading plants...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="font-sans min-h-screen">
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" onError={(e) => e.target.src = "/fallback-logo.png"} />
          
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
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
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 hover:bg-green-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-10">
        <h2 className="text-center text-3xl font-bold text-green-700 mb-6">All Plants</h2>
        <div className="flex justify-center p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl w-full">
            {plants
              .filter(
                (plant) =>
                  (selectedCategory === "All" || plant.category === selectedCategory) &&
                  plant.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((plant) => (
                <div
                  key={plant._id}
                  className="border rounded-lg p-3 shadow-lg text-center cursor-pointer hover:shadow-xl"
                  onClick={() => navigate(`/plant/${plant._id}`)}
                >
                  <img
                    src={plant.image || "/default-plant.jpg"}
                    alt={plant.name || "Plant"}
                    className="w-full h-60 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/default-plant.jpg")}
                  />
                  <h3 className="text-md font-bold mt-3 text-green-700">{plant.name || "Unnamed Plant"}</h3>
                  {renderStars(plant.rating)}
                  <p className="text-gray-500">
                    Stock: {plant.stock > 0 ? `${plant.stock} Available` : "Out of stock"}
                  </p>
                  <p className="text-gray-600 font-semibold">${plant.price || "0.00"}</p>
                </div>
              ))}
            {plants.filter(
              (plant) =>
                (selectedCategory === "All" || plant.category === selectedCategory) &&
                plant.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <p className="text-center text-gray-500 col-span-full">No plants match your criteria.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;