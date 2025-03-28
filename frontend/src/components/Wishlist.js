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
    <div className="font-sans min-h-screen bg-gray-100">
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

      <div className="p-6">
        <h2 className="text-3xl font-bold">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="mt-4">Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg shadow-lg text-center w-60 h-80 flex flex-col items-center justify-between bg-white"
              >
                <Link to={`/plant/${item._id}`}>
                  <img
                    src={item.plantImage}
                    alt={item.plantName}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/default-plant.jpg")}
                  />
                </Link>
                <h3 className="text-md font-bold mt-2">{item.plantName}</h3>
                <p className="text-gray-600">${item.itemPrice}</p>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Add to Cart
                </button>
                <button
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
                  onClick={() => {
                    const updatedWishlist = wishlist.filter((_, i) => i !== index);
                    setWishlist(updatedWishlist);
                    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <Link to="/shop" className="mt-4 inline-block text-green-600">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Wishlist;