import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";
import { motion } from "framer-motion";

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
    <div className="font-sans min-h-screen bg-white">
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
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/careers"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/about"
            className="text-green-700 font-bold text-lg hover:text-[#7ccc04] transition relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        
          <CustomerHeader />
        
      </nav>

      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm p-4 mx-4 mt-4 rounded-lg">
        <div className="text-gray-500 text-sm">
          <Link to="/" className="text-green-600 hover:text-green-700 transition">Home</Link> / About
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg p-12 mt-10 rounded-xl text-center animate-fade-in">
        <h2 className="text-5xl font-extrabold text-[#63A302] mb-6">About Us</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Welcome to AquaPlants – your trusted source for high-quality aquatic plants.
          We specialize in providing fresh, vibrant, and healthy plants for all aquatic enthusiasts.
          Whether you're a hobbyist or a professional, we have a wide range of plants to enhance your aquarium.
        </p>

        {/* Our Mission & Vision */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-[#F1FFDD] rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-[#528701] mb-4">Our Mission</h3>
            <p className="text-gray-700">
              Our mission is to promote sustainable aquascaping by providing
              the highest quality aquatic plants while ensuring environmental responsibility.
            </p>
          </motion.div>
          <motion.div
            className="bg-[#F1FFDD] rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-[#528701] mb-4">Our Vision</h3>
            <p className="text-gray-700">
              We envision a world where aquatic life thrives in every home,
              bringing tranquility and beauty through well-maintained aquariums.
            </p>
          </motion.div>
        </div>

        {/* Our Team */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-gray-500 mb-6">Meet Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((id) => (
              <motion.div
                key={id}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * id }}
              >
                <img
                  src={`/team${id}.jpg`}
                  alt={`Team Member ${id}`}
                  className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-white"
                  onError={(e) => (e.target.src = "/default-team.jpg")}
                />
                <h4 className="text-lg font-bold text-gray-800 mt-4">Team Member {id}</h4>
                <p className="text-gray-600">Aquatic Specialist</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-10 border-t-4 border-[#87de04]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-left">
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <Link
            to="/privacy"
            className="text-white font-medium text-lg hover:text-green-400 transition relative group">
            Privacy
          </Link><p></p>
          <Link
            to="/terms"
            className="text-white font-medium text-lg hover:text-green-400 transition relative group">
            Terms of Use
          </Link>
          
            <p className="hover:text-green-400 transition cursor-pointer">FAQs</p>
            <p className="hover:text-green-400 transition cursor-pointer">Shipping Policy</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>
              📧{" "}
              <a href="mailto:support@aquaplants.com" className="hover:text-green-400 transition">
                support@aquaplants.com
              </a>
            </p>
            <p>📞 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/facebook-icon.png" alt="Facebook" className="h-6" />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/instagram-icon.png" alt="Instagram" className="h-6" />
              </a>
              <a href="#" className="hover:scale-110 transition transform">
                <img src="/twitter-icon.png" alt="Twitter" className="h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <div className="flex rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 bg-gray-50 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="bg-green-600 px-4 py-2 text-white hover:bg-green-700 hover:scale-105 transition rounded-r-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center">© 2025 AquaPlants. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;