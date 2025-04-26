import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";
import axios from 'axios';
import { FaArrowLeft, FaArrowRight, FaChevronUp } from "react-icons/fa";

const Home = () => {
  const slides = [
    {
      image: "/hero-image1.jpg",
      title: "Explore Vibrant Aquatic Plants",
      description: "Discover a stunning variety of healthy aquatic plants to enhance your aquarium.",
    },
    {
      image: "/hero-image2.jpg",
      title: "Transform Your Aquarium",
      description: "Shop our premium selection of plants for a thriving underwater ecosystem.",
    },
    {
      image: "/hero-image3.jpg",
      title: "Fresh Plants, Fast Delivery",
      description: "Order today and get your aquatic plants delivered right to your door.",
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Auto-rotation for Hero Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-rotation for Reviews Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Reset transition state after animation completes
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentReviewIndex, isTransitioning]);

  useEffect(() => {
    axios.post('http://localhost:5000/api/visitor/record')
      .catch(err => console.error('Failed to record visit:', err));
  }, []);

  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        const data = await response.json();
        const selectedPlants = data.filter(plant => plant.quantity > 0).slice(0, 4).map(plant => ({
          name: plant.plantName,
          price: `$${plant.itemPrice.toFixed(2)}`,
          img: plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg',
        }));
        setFeaturedPlants(selectedPlants);
      } catch (error) {
        console.error("Error fetching featured plants:", error);
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

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % slides.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + slides.length) % slides.length);
  };

  const reviews = [
    { name: "Emily Thompson", review: "I love the quality of plants I received! Will order again.", img: "/user1.jpg" },
    { name: "James Anderson", review: "Fast delivery and excellent service. Highly recommend!", img: "/user2.jpg" },
    { name: "Sophia Martinez", review: "Vibrant plants, exceeded expectations.", img: "/user3.jpg" },
    { name: "Liam Davis", review: "Amazing variety and healthy plants!", img: "/user2.jpg" },
    { name: "Olivia Wilson", review: "Great customer support and quick shipping.", img: "/user1.jpg" },
  ];

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentReviewIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentReviewIndex(index * 3);
  };

  const dotCount = Math.ceil(reviews.length / 3);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-5 bg-white shadow-lg">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Aqua Plants Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium hover:text-green-800 transition">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-green-800 transition">Shop</Link>
          <Link to="/careers" className="text-gray-600 hover:text-green-800 transition">Careers</Link>
          <Link to="/about" className="text-gray-600 hover:text-green-800 transition">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-green-800 transition">Contact Us</Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Hero Section */}
      <header className="relative text-white h-[600px] pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${slides[currentImage].image})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight relative inline-block animate-slide-in-top">
              {slides[currentImage].title}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-green-400 transition-all duration-500 group-hover:w-full"></span>
            </h1>
            <p className="text-lg mt-4 text-gray-200 animate-slide-in-left delay-100">
              {slides[currentImage].description}
            </p>
            <button
              className="mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition transform hover:scale-105 shadow-lg hover:shadow-green-500/50 animate-bounce-in delay-200"
              onClick={handlePlantClick}
            >
              Shop Now
            </button>
          </div>
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full text-white hover:bg-white/40 transition animate-pulse"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-3 rounded-full text-white hover:bg-white/40 transition animate-pulse"
        >
          <FaArrowRight />
        </button>
        {/* Slider Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentImage === index ? 'bg-green-600 scale-125' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Video Section */}
      <section className="relative text-center py-16 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">Discover Our Aquatic Beauty</h2>
        <p className="text-gray-600 mt-2 animate-fade-in delay-100">
          Watch our showcase of beautiful aquatic plants.
        </p>
        <div className="mt-8 flex justify-center">
          <video controls className="w-[800px] h-[450px] rounded-2xl shadow-2xl object-cover">
            <source src="/promo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Featured Plants */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl md:text-4xl text-center font-bold text-green-800 mb-8 animate-fade-in">
          Featured Plants
        </h2>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 px-4">
          {featuredPlants.map((plant, idx) => (
            <div
              key={plant.name}
              onClick={handlePlantClick}
              className="w-72 bg-white rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer transition transform hover:-translate-y-1 flex flex-col items-center p-5 border border-green-100 animate-fade-in delay-200"
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
        <div className="text-center mt-8 animate-fade-in delay-300">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition transform hover:scale-105"
          >
            See More Plants
          </Link>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-10 bg-green-50"></div>
        <h2 className="text-3xl md:text-4xl text-center font-bold text-green-800 mb-12 animate-fade-in">
          Hear from Our Awesome Users!
        </h2>
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out ${
              isTransitioning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
            }`}
            style={{
              transform: `translateX(${isTransitioning ? '-10%' : '0'})`,
            }}
          >
            {getVisibleReviews().map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
              >
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-16 h-16 rounded-full mb-4 object-cover border-2 border-green-200"
                  onError={(e) => (e.target.src = "/default-user.jpg")}
                />
                <h3 className="text-lg font-semibold text-green-800 mb-2">{review.name}</h3>
                <p className="text-yellow-500 mb-2">★★★★★</p>
                <p className="text-gray-600 text-center text-sm">{review.review}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-6">
            {Array.from({ length: dotCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentReviewIndex / 3) === index ? 'bg-green-600 scale-125' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white text-center p-8">
        <h3 className="text-2xl font-bold">Sign Up Today and Get 10% Off Your First Order!</h3>
        <div className="max-w-md mx-auto mt-4 flex gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l-full bg-white text-gray-800 w-full focus:outline-none"
          />
          <button className="px-6 py-3 bg-black text-white rounded-r-full hover:bg-gray-800 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-10 text-center border-t-4 border-green-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-left">
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <p className="hover:text-green-400 transition">Privacy Policy</p>
            <p className="hover:text-green-400 transition">Terms of Use</p>
            <p className="hover:text-green-400 transition">FAQs</p>
            <p className="hover:text-green-400 transition">Shipping Policy</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>📧 <a href="mailto:support@aquaplants.com" className="hover:text-green-400 transition">support@aquaplants.com</a></p>
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
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-l bg-gray-800 text-white w-full focus:outline-none"
              />
              <button className="bg-green-600 px-4 py-2 rounded-r text-white hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <p className="mt-8">© 2025 AquaPlants. All rights reserved.</p>
        <button
          onClick={handleBackToTop}
          className="mt-4 p-3 bg-green-600 rounded-full text-white hover:bg-green-700 transition transform hover:scale-105"
        >
          <FaChevronUp />
        </button>
      </footer>
    </>
  );
};

export default Home;