import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
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

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === plant._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...plant, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setShowPopup(true);
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some((item) => item._id === plant._id)) {
      wishlist.push(plant);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
    navigate("/wishlist");
  };

  if (!plant) return <div className="text-center p-10 text-gray-500 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 relative">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">{plant.plantName}</h1>
        <img
          src={plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg'}
          alt={plant.plantName}
          className="w-full h-80 object-cover rounded-lg mb-6 shadow-md"
        />
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gray-300 text-xl">★</span>
          ))}
        </div>
        <div className="space-y-4">
          <p><strong>Category:</strong> {plant.category || "N/A"}</p>
          <p><strong>Description:</strong> {plant.description || "N/A"}</p>
          <p><strong>Available Quantity:</strong> {plant.quantity} units</p>
          <p><strong>Item Price:</strong> ${plant.itemPrice.toFixed(2)}</p>
          <p><strong>Expiration Date:</strong> {new Date(plant.expirationDate).toLocaleDateString()}</p>
          <div className="flex items-center gap-4">
            <label><strong>Quantity:</strong></label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2">
              <FaMinus />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(plant.quantity, parseInt(e.target.value))))}
              className="w-16 text-center border rounded"
              min="1"
              max={plant.quantity}
            />
            <button onClick={() => setQuantity(Math.min(plant.quantity, quantity + 1))} className="p-2">
              <FaPlus />
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              <FaHeart /> Add to Wishlist
            </button>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-green-600 text-4xl mb-4">✔</div>
              <p className="text-lg font-semibold">Product successfully added to your cart!</p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/cart");
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/checkout");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetails;