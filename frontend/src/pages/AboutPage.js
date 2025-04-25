// CRIPS\frontend\src\pages\AboutPage.js

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader"; // Adjust the import path based on your structure

const AboutPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUserInfo(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
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
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-green-600 font-bold">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* 🔹 Conditional Rendering for Cart & Profile */}
        {userInfo ? (
          <CustomerHeader />
        ) : (
          <div className="space-x-4">
            <Link to="/customerregister" className="border px-4 py-2 rounded text-green-600">
              Sign Up
            </Link>
            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">
              Login
            </Link>
          </div>
        )}
      </nav>
      {/* 🔹 Breadcrumb Navigation (Optional) */}
            <div className="text-gray-500 mb-4 p-6">
              <Link to="/" className="hover:underline">Home</Link> / About
            </div>

      {/* 🔹 About Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 mt-10 rounded-lg text-center">
        <h2 className="text-4xl font-bold text-green-600 mb-6">About Us</h2>
        <p className="text-lg text-gray-600">
          Welcome to AquaPlants – your trusted source for high-quality aquatic plants.
          We specialize in providing fresh, vibrant, and healthy plants for all aquatic enthusiasts.
          Whether you're a hobbyist or a professional, we have a wide range of plants to enhance your aquarium.
        </p>

        {/* 🔹 Our Mission & Vision */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
          <p className="text-gray-600 mt-2">
            Our mission is to promote sustainable aquascaping by providing  
            the highest quality aquatic plants while ensuring environmental responsibility.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
          <p className="text-gray-600 mt-2">
            We envision a world where aquatic life thrives in every home,  
            bringing tranquility and beauty through well-maintained aquariums.
          </p>
        </div>

        {/* 🔹 Our Team (Optional) */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800">Meet Our Team</h3>
          <div className="flex justify-center gap-6 mt-4">
            {[1, 2, 3].map((id) => (
              <div key={id} className="border rounded-lg p-4 shadow-lg text-center">
                <img
                  src={`/team${id}.jpg`}
                  alt={`Team Member ${id}`}
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                  onError={(e) => (e.target.src = "/default-team.jpg")} // Fallback image
                />
                <h4 className="text-lg font-bold mt-2">Team Member {id}</h4>
                <p className="text-gray-600">Aquatic Specialist</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="bg-gray-900 text-white p-10 text-center mt-10">
        <p>© 2025 AquaPlants. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;