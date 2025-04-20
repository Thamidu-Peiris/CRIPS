// frontend\src\dashboards\Customer\PlantDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import CustomerHeader from "../../components/CustomerHeader";

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
        const data = await response.json();
        const sortedPlants = data
          .filter((p) => p.quantity > 0 && p._id !== id)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 4);
        setPopularPlants(sortedPlants);
      } catch (error) {
        console.error("Error fetching popular plants:", error);
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

  if (!plant) return <div className="text-center p-10 text-gray-500 text-lg">Loading...</div>;

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-green-600 font-medium hover:text-green-700 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-gray-600 hover:text-gray-800 transition-colors">
            Shop
          </Link>
          <Link to="/careers" className="text-gray-600 hover:text-gray-800 transition-colors">
            Careers
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">
            Contact Us
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Plant Details Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Left Side: Image */}
          <div className="md:w-1/2">
            <img
              src={plant.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
              alt={plant.plantName}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Right Side: Details */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700 mb-4">{plant.plantName}</h1>
              <div className="flex justify-start gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gray-300 text-xl">★</span>
                ))}
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong className="text-gray-900">Category:</strong> {plant.category || "N/A"}</p>
                <p><strong className="text-gray-900">Description:</strong> {plant.description || "N/A"}</p>
                <p><strong className="text-gray-900">Available Quantity:</strong> {plant.quantity} units</p>
                <p><strong className="text-gray-900">Item Price:</strong> <span className="text-green-600 font-semibold">${plant.itemPrice.toFixed(2)}</span></p>
                <p><strong className="text-gray-900">Expiration Date:</strong> {new Date(plant.expirationDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-900 font-medium">Quantity:</label>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(plant.quantity, parseInt(e.target.value))))}
                  className="w-16 text-center border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                  max={plant.quantity}
                />
                <button
                  onClick={() => setQuantity(Math.min(plant.quantity, quantity + 1))}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(plant)}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => handleAddToWishlist(plant)}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
                >
                  <FaHeart /> Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-600 text-4xl mb-4">✔</div>
            <p className="text-lg font-semibold text-gray-800">Product successfully added to your cart!</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/cart");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/checkout");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Plants Section */}
      <section className="py-10 bg-white">
        <h2 className="text-center text-3xl font-bold text-green-700 mb-6">Popular Plants</h2>
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularPlants.length > 0 ? (
              popularPlants.map((popularPlant) => (
                <div
                  key={popularPlant._id}
                  className="relative border rounded-lg p-3 shadow-md text-center bg-white group hover:shadow-lg transition-shadow"
                >
                  <Link to={`/plant/${popularPlant._id}`}>
                    <img
                      src={popularPlant.plantImage || "http://localhost:5000/uploads/default-plant.jpg"}
                      alt={popularPlant.plantName}
                      className="w-full h-60 object-cover rounded-md"
                    />
                  </Link>
                  <h3 className="text-md font-bold mt-3 text-green-700">{popularPlant.plantName}</h3>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gray-300 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-green-600 font-semibold mt-1">${popularPlant.itemPrice.toFixed(2)}</p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaShoppingCart
                      className="text-green-600 text-2xl cursor-pointer mb-2"
                      onClick={() => handleAddToCart(popularPlant)}
                    />
                    <FaHeart
                      className="text-red-500 text-2xl cursor-pointer"
                      onClick={() => handleAddToWishlist(popularPlant)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No popular plants available at the moment.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantDetails;