import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios"; // Import Axios

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(user);
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      if (response.data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        alert("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again later.");
    }
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
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600 font-bold">Contact Us</Link>
        </div>

        {/* 🔹 Cart & User Authentication */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart">
            <FaShoppingCart className="text-gray-600 text-xl cursor-pointer" />
          </Link>

          {/* Show Sign Up & Login if NOT logged in */}
          {!userInfo ? (
            <div className="space-x-4">
              <Link to="/customerregister" className="border px-4 py-2 rounded text-green-600">
                Sign Up
              </Link>
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">
                Login
              </Link>
            </div>
          ) : (
            // Show Profile Icon if Logged In
            <div className="relative">
              <button className="flex items-center bg-gray-200 px-4 py-2 rounded-full">
                <span className="mr-2">{userInfo.username}</span>
                <img src="/profile-icon.png" alt="Profile" className="h-8 w-8 rounded-full" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 🔹 Contact Form */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 mt-10 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Contact Us</h2>
        {submitted ? (
          <p className="text-center text-green-600 font-bold">Thank you! Your message has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border rounded-lg bg-gray-100"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
