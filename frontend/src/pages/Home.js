// frontend\src\pages\Home.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";
import axios from 'axios';

const Home = () => {
  const images = ["/hero-image1.jpg", "/hero-image2.jpg", "/hero-image3.jpg"];
  const [currentImage, setCurrentImage] = useState(0);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.post('http://localhost:5000/api/visitor/record')
      .catch(err => console.error('Failed to record visit:', err));
  }, []);

  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        const data = await response.json();
        // Select the first 4 plants as featured (or apply a specific filter if needed)
        const selectedPlants = data.filter(plant => plant.quantity > 0).slice(0, 4).map(plant => ({
          name: plant.plantName,
          price: `$${plant.itemPrice.toFixed(2)}`,
          img: plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg',
        }));
        setFeaturedPlants(selectedPlants);
      } catch (error) {
        console.error("Error fetching featured plants:", error);
        // Fallback to default plants if the fetch fails
        setFeaturedPlants([
          { name: "Anubias Nana", price: "$14.99", img: "/plant1.jpg" },
          { name: "Java Fern", price: "$12.99", img: "/plant2.jpg" },
          { name: "Water Sprite", price: "$9.99", img: "/plant3.jpg" },
          { name: "Amazon Sword", price: "$15.99", img: "/plant4.jpg" },
        ]);
      }
    };
    fetchFeaturedPlants();
  }, []);

  const handlePlantClick = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/shop");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        {/* Logo Section */}
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Aqua Plants Logo" className="h-10 mr-2" />
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>

        {/* Cart, Wishlist, Profile (via CustomerHeader) */}
        <CustomerHeader />
      </nav>

      {/* Hero Section */}
      <header
        className="relative text-center text-white py-32 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">Welcome to Aqua Plants Export</h1>
          <h3 className="text-lg mt-2">Order Fresh Aquatic Plants Online</h3>
          <button
            className="mt-4 px-6 py-2 bg-red-500 rounded text-white"
            onClick={handlePlantClick}
          >
            Explore Now
          </button>
        </div>
      </header>

      {/* Video Section */}
      <section className="text-center py-10">
        <h2 className="text-2xl font-bold">Discover Our Aquatic Beauty</h2>
        <p className="text-gray-600 mt-2">Watch our showcase of beautiful aquatic plants.</p>
        <div className="mt-6 flex justify-center">
          <video controls className="w-[600px] h-[350px] rounded-xl shadow-lg object-cover">
            <source src="/promo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-green-800 mb-8">Featured Plants</h2>
        <div className="flex flex-wrap justify-center gap-8 px-4">
          {featuredPlants.map((plant, idx) => (
            <div
              key={plant.name}
              onClick={handlePlantClick}
              className="w-72 bg-white rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer transition transform hover:-translate-y-1 flex flex-col items-center p-5 border border-green-50 animate-fade-in"
            >
              <img
                src={plant.img}
                alt={plant.name}
                className="w-full h-44 object-cover rounded-xl mb-4"
                onError={(e) => (e.target.src = "/default-plant.jpg")}
              />
              <h3 className="text-lg font-semibold text-green-800 mb-2">{plant.name}</h3>
              <p className="text-green-600 font-bold text-xl mb-2">{plant.price}</p>
              <button className="px-5 py-2 text-sm rounded-full bg-green-500 hover:bg-green-700 text-white mt-auto transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-10 bg-gray-100">
        <h2 className="text-center text-3xl font-bold text-gray-800">Hear from our awesome users!</h2>
        <div className="flex justify-center p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {["Emily Thompson", "James Anderson", "Sophia Martinez"].map((name, index) => (
              <div key={index} className="border rounded-lg p-5 shadow-lg text-center bg-white">
                <img
                  src={`/user${index + 1}.jpg`}
                  alt={name}
                  className="w-16 h-16 rounded-full mx-auto"
                  onError={(e) => (e.target.src = "/default-user.jpg")}
                />
                <h3 className="text-md font-bold mt-2">{name}</h3>
                <p className="text-yellow-500">★★★★★</p>
                <p className="text-gray-600 mt-2">
                  {index === 0
                    ? "I love the quality of plants I received! Will order again."
                    : index === 1
                    ? "Fast delivery and excellent service. Highly recommend!"
                    : "Vibrant plants, exceeded expectations."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="bg-green-500 text-white text-center p-6 text-lg font-bold">
        Sign up today and get 10% off your first order!
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-10 text-center">
        <div className="grid grid-cols-4 gap-6 px-10 text-left">
          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <p>Privacy Policy</p>
            <p>Terms of Use</p>
            <p>FAQs</p>
            <p>Shipping Policy</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p>📧 support@aquaplants.com</p>
            <p>📞 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#"><img src="/facebook-icon.png" alt="Facebook" className="h-6" /></a>
              <a href="#"><img src="/instagram-icon.png" alt="Instagram" className="h-6" /></a>
              <a href="#"><img src="/twitter-icon.png" alt="Twitter" className="h-6" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold">Newsletter</h3>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-l bg-gray-800 text-white w-full"
              />
              <button className="bg-green-500 px-4 py-2 rounded-r text-white">Subscribe</button>
            </div>
          </div>
        </div>
        <p className="mt-6">© 2025 AquaPlants. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;