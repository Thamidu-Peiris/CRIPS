import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.itemPrice, 0);
  const finalTotal = totalCost - discount;

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/csm/coupons`);
      const coupons = await response.json();
      const coupon = coupons.find((c) => c.code === couponCode && c.isActive);
      if (coupon) {
        setDiscount((totalCost * coupon.discountPercentage) / 100);
      } else {
        alert("Invalid or inactive coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const handleCheckout = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/customerregister");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-3" />
        </div>
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

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500 text-lg text-center mt-10">Your cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.plantImage}
                      alt={item.plantName}
                      className="w-24 h-24 object-cover rounded-md mr-4"
                      onError={(e) => (e.target.src = "/default-plant.jpg")}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.plantName}</h3>
                      <p className="text-gray-600">
                        ${item.itemPrice.toFixed(2)} x {item.quantity}
                      </p>
                      <p className="text-green-600 font-medium">
                        ${(item.itemPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                      onClick={() => {
                        const updatedCart = cart.filter((_, i) => i !== index);
                        setCart(updatedCart);
                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <p className="flex justify-between text-gray-600">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </p>
                {discount > 0 && (
                  <p className="flex justify-between text-red-500">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </p>
                )}
                <p className="flex justify-between text-gray-800 font-semibold border-t pt-2">
                  <span>Final Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}
        <Link
          to="/shop"
          className="mt-6 inline-block text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;