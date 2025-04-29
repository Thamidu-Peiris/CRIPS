import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";

const Checkout = () => {
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [cardType, setCardType] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false); // New state for order success
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.itemPrice, 0);
  const couponCode = localStorage.getItem("couponCode") || "";
  const discount = localStorage.getItem("discount") ? parseFloat(localStorage.getItem("discount")) : 0;
  const finalTotal = totalCost - discount;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value
      .match(/.{1,4}/g)
      ?.join(" ")
      .trim() || value;
    setCardDetails({ ...cardDetails, cardNumber: formatted });

    if (value.startsWith("4")) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(value)) {
      setCardType("mastercard");
    } else {
      setCardType("");
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^\d\/]/g, "");
    if (value.length > 5) value = value.slice(0, 5);
    if (value.length === 2 && !value.includes("/")) {
      value = `${value}/`;
    }
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.id) {
      setError("Please log in to complete your purchase.");
      navigate("/login");
      return;
    }

    console.log("User ID:", userInfo.id);

    const validItems = cart.every(item => item._id && item.plantName && item.quantity && item.itemPrice);
    if (!validItems) {
      setError("Invalid cart items. Please check your cart.");
      return;
    }

    const cardNumberDigits = cardDetails.cardNumber.replace(/\s/g, "");
    if (cardNumberDigits.length !== 16) {
      setError("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      setError("Expiry date must be in MM/YY format.");
      return;
    }
    if (cardDetails.cvv.length !== 3) {
      setError("CVV must be 3 digits.");
      return;
    }

    const order = {
      userId: userInfo.id,
      items: cart.map(item => ({
        plantId: item._id,
        plantName: item.plantName,
        quantity: item.quantity,
        itemPrice: item.itemPrice,
      })),
      shippingInfo,
      total: finalTotal,
      paymentMethod,
      couponCode,
      couponDiscount: discount,
    };

    console.log("Submitting order:", order);
    try {
      const response = await axios.post("http://localhost:5000/api/orders", order);
      console.log("Order response:", response.data);
      localStorage.removeItem("cart");
      localStorage.removeItem("couponCode");
      localStorage.removeItem("discount");
      setOrderSuccess(true); // Set success state
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
      setError("Failed to process payment: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pt-0">
      {/* Navigation */}
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
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
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

      {/* Content */}
      <div className="px-4 pb-12">
        <h2 className="text-4xl font-extrabold text-green-800 mt-8 mb-6 text-center">Checkout</h2>
        {error && <p className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 text-center">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(shippingInfo).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    placeholder={key.split(/(?=[A-Z])/).join(" ")}
                    value={shippingInfo[key]}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, [key]: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-6"
            >
              Continue to Payment Method
            </button>
          </form>
        ) : orderSuccess ? (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-green-100 text-green-800 font-bold p-6 rounded-lg text-center">
              Payment completed successfully!
            </div>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-6"
            >
              View Orders
            </button>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="bg-green-100 rounded-xl p-6 mb-6">
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="flex justify-between mb-2 text-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span>{item.plantName} x {item.quantity}</span>
                  <span>${(item.quantity * item.itemPrice).toFixed(2)}</span>
                </motion.div>
              ))}
              {discount > 0 && (
                <>
                  <p className="text-gray-700">Coupon Added: {couponCode}</p>
                  <p className="text-gray-700">Discount: -${discount.toFixed(2)}</p>
                </>
              )}
              <p className="text-green-800 font-bold">Total: ${finalTotal.toFixed(2)}</p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 text-lg border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full p-4 pr-12 text-lg border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
                {cardType === "visa" && (
                  <img
                    src="/visa-icon.png"
                    alt="Visa"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
                {cardType === "mastercard" && (
                  <img
                    src="/mastercard-icon.png"
                    alt="MasterCard"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="w-full p-4 text-lg border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    maxLength={3}
                    className="w-full p-4 text-lg border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-6"
            >
              Pay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;