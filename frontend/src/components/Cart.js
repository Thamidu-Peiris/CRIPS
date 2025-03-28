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
        <h2 className="text-3xl font-bold">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="mt-4">Your cart is empty</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg shadow-lg text-center w-60 h-80 flex flex-col items-center justify-between bg-white"
                >
                  <img
                    src={item.plantImage}
                    alt={item.plantName}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/default-plant.jpg")}
                  />
                  <h3 className="text-md font-bold mt-2">{item.plantName}</h3>
                  <p className="text-gray-600">${item.itemPrice} x {item.quantity}</p>
                  <button
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
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
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Order Summary</h3>
              <p>Total Cost: ${totalCost.toFixed(2)}</p>
              {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
              <p>Final Total: ${finalTotal.toFixed(2)}</p>
              <div className="mt-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border p-2 rounded"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
              >
                Continue to Checkout
              </button>
            </div>
          </>
        )}
        <Link to="/shop" className="mt-4 inline-block text-green-600">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Cart;