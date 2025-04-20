// frontend\src\pages\Checkout.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
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
      alert("Payment completed successfully!");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
      setError("Failed to process payment: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {step === 1 ? (
        <form onSubmit={handleShippingSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          {Object.keys(shippingInfo).map((key) => (
            <input
              key={key}
              type={key === "email" ? "email" : "text"}
              placeholder={key.split(/(?=[A-Z])/).join(" ")}
              value={shippingInfo[key]}
              onChange={(e) => setShippingInfo({ ...shippingInfo, [key]: e.target.value })}
              className="w-full p-2 border rounded mb-4"
              required
            />
          ))}
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Continue to Payment Method
          </button>
        </form>
      ) : (
        <form onSubmit={handlePaymentSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between mb-2">
              <span>{item.plantName} x {item.quantity}</span>
              <span>${(item.quantity * item.itemPrice).toFixed(2)}</span>
            </div>
          ))}
          {discount > 0 && (
            <>
              <p>Coupon Added: {couponCode}</p>
              <p>Discount: -${discount.toFixed(2)}</p>
            </>
          )}
          <p className="font-bold">Total: ${finalTotal.toFixed(2)}</p>

          <h3 className="text-xl font-semibold mt-6 mb-4">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="card">Credit/Debit Card</option>
          </select>
          <input
            type="text"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Pay
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;