import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../../components/CustomerHeader";
import { FaHeart, FaStar, FaRegStar, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [allPlants, setAllPlants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // ✅ Fetch Single Plant by ID
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/grower-handler/${id}`);
        setPlant(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plant:", error);
        setLoading(false);
      }
    };
    fetchPlant();
  }, [id]);

  // ✅ Fetch All Plants for "Explore More"
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/grower-handler/");
        setAllPlants(data);
      } catch (error) {
        console.error("Error fetching all plants:", error);
      }
    };
    fetchPlants();
  }, []);

  const renderStars = (rating) => (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) =>
        index < rating ? <FaStar key={index} className="text-yellow-500" /> : <FaRegStar key={index} className="text-gray-400" />
      )}
    </div>
  );

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ ...plant, quantity });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Plant added to cart!");
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/plants/${id}/reviews`);
      setReviews(data);
      setActiveTab("reviews");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!plant) return <p className="text-center mt-5 text-red-500">Plant not found</p>;

  const exploreMorePlants = allPlants.filter((p) => p._id !== id).slice(0, 4);

  return (
    <div>
      {/* Navigation */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        <CustomerHeader />
      </nav>

      <div className="max-w-6xl mx-auto p-5">
        <p className="text-gray-500 text-sm">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span className="font-semibold text-gray-700">{plant.plantName}</span>
        </p>

        <div className="flex flex-col md:flex-row mt-5 gap-6">
          <div className="md:w-1/2">
            <img src={plant.plantImage} alt={plant.plantName} className="w-full h-96 object-cover rounded-lg shadow-md" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800">{plant.plantName}</h2>
            <div className="flex items-center mt-3">
              <span className="text-2xl font-bold text-green-600">${plant.price}</span>
            </div>
            <div className="mt-2">{renderStars(plant.rating || 4)}</div>
            <p className="text-gray-600 mt-2"><span className="font-semibold">Status:</span> {plant.plantAvailability}</p>
            <div className="flex items-center mt-4 space-x-3">
              <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} className="p-2 bg-gray-200 rounded"><FaMinus /></button>
              <span className="px-4 py-2 border rounded">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-gray-200 rounded"><FaPlus /></button>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <button onClick={handleAddToCart} className="px-5 py-2 bg-green-600 text-white rounded flex items-center">
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button className="px-5 py-2 bg-blue-600 text-white rounded">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-5">
          <div className="flex space-x-6 border-b pb-2">
            <button className={`text-gray-700 font-semibold pb-1 ${activeTab === "description" ? "border-b-2 border-green-500" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`text-gray-500 pb-1 ${activeTab === "reviews" ? "border-b-2 border-green-500" : ""}`} onClick={fetchReviews}>Reviews</button>
          </div>
          {activeTab === "description" ? (
            <p className="mt-3 text-gray-600">{plant.description}</p>
          ) : (
            <div className="mt-3">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review._id} className="border-b pb-2 mb-2">
                  <p className="text-gray-700 font-semibold">{review.username}</p>
                  <div className="flex">{renderStars(review.rating)}</div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              )) : <p className="text-gray-500">No reviews yet. Be the first to review!</p>}
            </div>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800">Explore More</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {exploreMorePlants.map((p) => (
              <div key={p._id} className="border rounded-lg p-3 text-center shadow-md cursor-pointer hover:shadow-lg" onClick={() => navigate(`/plant/${p._id}`)}>
                <img src={p.plantImage} alt={p.plantName} className="w-full h-40 object-cover rounded-md" />
                <h4 className="mt-2 font-semibold">{p.plantName}</h4>
                <p className="text-gray-500">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
