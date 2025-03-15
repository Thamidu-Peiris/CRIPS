import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      {/* 🔹 Navbar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>

        {/* 🔹 Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/orders" className="text-gray-600">Orders</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* 🔹 Cart & Profile */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart">
            <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-200 px-4 py-2 rounded-full"
            >
              <span className="mr-2">{username}</span>
              <FaUserCircle className="text-gray-600 text-xl" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-10">
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                <Link to="/dashboard/tracking" className="block px-4 py-2 hover:bg-gray-100">Tracking</Link>
                <Link to="/dashboard/support" className="block px-4 py-2 hover:bg-gray-100">Support</Link>
                <Link to="/dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <button onClick={handleLogout} className="block px-4 py-2 hover:bg-red-100 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔹 Breadcrumb Navigation */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> / Orders
      </div>

      {/* 🔹 Orders Table */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Orders</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left bg-gray-100">
                <th className="p-3">Order</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Options</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className="border-b text-sm">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">{order.paymentMethod}</td>
                    <td className={`p-3 font-semibold ${order.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
                      {order.status}
                    </td>
                    <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No records found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
