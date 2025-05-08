import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

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
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState(localStorage.getItem("couponCode") || "");
  const [discount, setDiscount] = useState(localStorage.getItem("discount") ? parseFloat(localStorage.getItem("discount")) : 0);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCost = cart.reduce((sum, item) => sum + item.quantity * item.itemPrice, 0);
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

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setError("Please enter a coupon code.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/api/csm/coupons");
      const coupons = response.data;
      const coupon = coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive);
      if (coupon) {
        const discountAmount = (totalCost * coupon.discountPercentage) / 100;
        setDiscount(discountAmount);
        localStorage.setItem("couponCode", couponCode.toUpperCase());
        localStorage.setItem("discount", discountAmount.toString());
        setError("");
      } else {
        setError("Invalid or inactive coupon code.");
        setDiscount(0);
        localStorage.removeItem("couponCode");
        localStorage.removeItem("discount");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("Failed to apply coupon. Please try again.");
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.id) {
      setError("Please log in to complete your purchase.");
      navigate("/login");
      return;
    }

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
      couponCode: couponCode.toUpperCase(),
      couponDiscount: discount,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/orders", order);
      console.log("Order response:", response.data);
      localStorage.removeItem("cart");
      localStorage.removeItem("couponCode");
      localStorage.removeItem("discount");
      setOrderSuccess(true);
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
      setError("Failed to process payment: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-0">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
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
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/careers"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <motion.h2
          className="text-5xl font-extrabold text-green-900 mb-12 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Checkout
        </motion.h2>
        {error && (
          <motion.p
            className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        {step === 1 ? (
          <motion.form
            onSubmit={handleShippingSubmit}
            className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto animate-fade-in"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
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
            <motion.button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Payment Method
            </motion.button>
          </motion.form>
        ) : orderSuccess ? (
          <div className="relative min-h-[60vh] flex items-center justify-center">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              tweenDuration={1000}
            />
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg
                  className="w-16 h-16 mx-auto text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-3xl font-bold text-green-900 mb-4">
                Order Confirmed!
              </h3>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order has been successfully
                processed.
              </p>
              <motion.button
                onClick={() => navigate("/dashboard/orders")}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Orders
              </motion.button>
              <motion.button
                onClick={() => navigate("/shop")}
                className="w-full mt-4 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <motion.form
            onSubmit={handlePaymentSubmit}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-3xl font-bold text-green-900 mb-8">Order Summary</h3>
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              {cart.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="flex justify-between mb-3 text-gray-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="font-medium">{item.plantName} x {item.quantity}</span>
                  <span className="font-semibold">${(item.quantity * item.itemPrice).toFixed(2)}</span>
                </motion.div>
              ))}
              <div className="mt-6 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-3 bg-green-50 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyCoupon}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all shadow-md"
                >
                  Apply
                </motion.button>
              </div>
              {discount > 0 && (
                <>
                  <p className="text-gray-700 mt-3 font-medium">Coupon Applied: {couponCode}</p>
                  <p className="text-red-500 mt-1 font-semibold">Discount: -${discount.toFixed(2)}</p>
                </>
              )}
              <p className="text-green-900 font-bold text-xl mt-4">Total: ${finalTotal.toFixed(2)}</p>
            </div>

            <h3 className="text-3xl font-bold text-green-900 mb-8">Payment Method</h3>
            <div className="space-y-6">
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-4 text-lg border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="card">Credit/Debit Card</option>
                </select>
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Payment Method
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full p-4 pr-12 text-lg border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                  Card Number
                </label>
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
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="w-full p-4 text-lg border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    Expiry (MM/YY)
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    maxLength={3}
                    className="w-full p-4 text-lg border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-medium text-gray-700">
                    CVV
                  </label>
                </div>
              </div>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-4 rounded-full font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-300 mt-8 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pay Now
            </motion.button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Checkout;