import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart, FaStar, FaRegStar, FaPlus, FaMinus, FaUserCircle } from "react-icons/fa";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [plants, setPlants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        console.log("Fetching plant with ID:", id); // Log for debugging
        const { data } = await axios.get(`http://localhost:5000/api/plants/${id}`);
        console.log("Fetched plant:", data); // Log for debugging
        setPlant(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plant details:", error.response || error.message);
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/plants");
        setPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };
    fetchPlants();
  }, []);

  const fetchReviews = async () => {
    try {
      console.log("Fetching reviews for plant ID:", id);
      const { data } = await axios.get(`http://localhost:5000/api/plants/${id}/reviews`);
      console.log("Reviews data:", data);
      setReviews(data);
      setActiveTab("reviews");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!plant) return <p className="text-center mt-5 text-red-500">Plant not found</p>;

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, index) => (
          index < rating ? <FaStar key={index} className="text-yellow-500" /> : <FaRegStar key={index} className="text-gray-400" />
        ))}
      </div>
    );
  };

  const exploreMorePlants = plants.filter((p) => p._id !== id).slice(0, 4); // Fixed to use _id

  return (
    <div>
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/customerdashboard" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
            >
              <span className="mr-2">Profile</span>
              <FaUserCircle className="text-gray-600 text-xl" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-10">
                <Link to="/customerdashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/dashboard/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/dashboard/tracking" className="block px-4 py-2 hover:bg-gray-100">Tracking</Link>
                <Link to="/dashboard/support" className="block px-4 py-2 hover:bg-gray-100">Support</Link>
                <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("userInfo");
                    navigate("/login");
                  }}
                  className="block px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-5">
        <p className="text-gray-500 text-sm">
          <Link to="/">Home</Link> / <Link to="/customerdashboard">Shop</Link> / <span className="font-semibold text-gray-700">{plant.name}</span>
        </p>

        <div className="flex flex-col md:flex-row mt-5 gap-6">
          <div className="md:w-1/2">
            <img src={plant.image} alt={plant.name} className="w-full h-96 object-cover rounded-lg shadow-md" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800">{plant.name}</h2>
            <div className="flex items-center mt-3">
              <span className="text-2xl font-bold text-green-600">${plant.price}</span>
            </div>
            <div className="mt-2">{renderStars(plant.rating || 0)}</div>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Status:</span> {plant.stock > 0 ? `In Stock: ${plant.stock} available` : "Out of Stock"}
            </p>
            <div className="flex items-center mt-4 space-x-3">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="p-2 bg-gray-200 rounded"
              >
                <FaMinus />
              </button>
              <span className="px-4 py-2 border rounded">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity < plant.stock ? quantity + 1 : plant.stock)}
                className="p-2 bg-gray-200 rounded"
              >
                <FaPlus />
              </button>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <button className="px-5 py-2 bg-green-600 text-white rounded flex items-center">
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button className="px-5 py-2 bg-blue-600 text-white rounded flex items-center">
                🛒 Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-5">
          <div className="flex space-x-6 border-b pb-2">
            <button
              className={`text-gray-700 font-semibold pb-1 ${activeTab === "description" ? "border-b-2 border-green-500" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`text-gray-500 pb-1 ${activeTab === "reviews" ? "border-b-2 border-green-500" : ""}`}
              onClick={fetchReviews}
            >
              Reviews
            </button>
          </div>
          {activeTab === "description" ? (
            <p className="mt-3 text-gray-600">{plant.description}</p>
          ) : (
            <div className="mt-3">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-2 mb-2">
                    <p className="text-gray-700 font-semibold">{review.username}</p>
                    <div className="flex">{renderStars(review.rating)}</div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {exploreMorePlants.map((plant) => (
              <div
                key={plant._id} // Fixed to use _id
                className="border rounded-lg p-3 text-center shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/plant/${plant._id}`)} // Fixed to use _id
              >
                <img src={plant.image} alt={plant.name} className="w-full h-40 object-cover rounded-md" />
                <h4 className="mt-2 font-semibold">{plant.name}</h4>
                <p className="text-gray-500">${plant.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;