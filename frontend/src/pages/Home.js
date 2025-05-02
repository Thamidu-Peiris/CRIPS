import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronUp,
  FaWater,
  FaLeaf,
  FaTree,
  FaPagelines,
  FaSeedling,
  FaShoppingBasket,
  FaBoxOpen,
  FaTruck,
  FaAngleDown,
} from "react-icons/fa";

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

  const categories = [
    { name: "Floating", icon: <FaWater /> },
    { name: "Submerged", icon: <FaLeaf /> },
    { name: "Emergent", icon: <FaTree /> },
    { name: "Marginal", icon: <FaPagelines /> },
    { name: "Mosses", icon: <FaSeedling /> },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // State for auto-scrolling category slider
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const categorySliderRef = useRef(null);

  // Handle scroll to toggle border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update user state and cart
  useEffect(() => {
    const updateUserState = () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setFirstName(userInfo.firstName || "");
        setLastName(userInfo.lastName || "");
        const imagePath = userInfo.profileImage
          ? `http://localhost:5000${userInfo.profileImage}`
          : "/default-profile.png";
        setProfileImage(imagePath);
        setIsLoggedIn(true);
      } else {
        setFirstName("");
        setLastName("");
        setProfileImage("/default-profile.png");
        setIsLoggedIn(false);
      }

      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    };

    updateUserState();

    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userInfoChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userInfoChanged", handleStorageChange);
    };
  }, []);

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

  // Auto-scrolling for Category Slider
  useEffect(() => {
    if (isPaused) return;

    const categoryWidth = 160;
    const totalCategories = categories.length;
    const maxScroll = categoryWidth * totalCategories;

    const interval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        const newPosition = prevPosition + 1;
        if (newPosition >= maxScroll) {
          categorySliderRef.current.scrollTo({ left: 0, behavior: "instant" });
          return 0;
        }
        categorySliderRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
        return newPosition;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [categories.length, isPaused]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/visitor/record")
      .catch((err) => console.error("Failed to record visit:", err));
  }, []);

  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        const data = await response.json();
        const selectedPlants = data
          .filter((plant) => plant.quantity > 0)
          .slice(0, 4)
          .map((plant) => ({
            name: plant.plantName,
            price: `$${plant.itemPrice.toFixed(2)}`,
            img: plant.plantImage || "http://localhost:5000/uploads/default-plant.jpg",
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

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setFirstName("");
    setLastName("");
    setProfileImage("/default-profile.png");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
    window.dispatchEvent(new Event("userInfoChanged"));
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <>
      {/* Hero Section with Fixed Header */}
      <header className="relative text-white h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url(${slides[currentImage].image})`,
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
        {/* Fixed Header Wrapper */}
        <div className="fixed top-0 left-0 w-full z-50 h-24 flex items-center justify-center pt-4">
          <nav
            className={`flex justify-between items-center px-6 py-3 w-[90%] max-w-5xl bg-white shadow-lg rounded-full transition-all duration-300 ${
              isScrolled ? "border-4 border-[#7ccc04]" : ""
            }`}
          >
            <img src="/logo.png" alt="Logo" className="h-12" />
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-green-700 font-bold text-lg hover:text-[#7ccc04] transition relative group"
              >
                Home
                <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-100 transition-transform duration-300"></span>
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
                className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
              >
                About
                <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
              >
                Contact Us
                <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Cart Link */}
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-black hover:text-gray-700 relative transition duration-300"
                >
                  <img
                    src="/home/cart-icon.png"
                    alt="Cart"
                    className="w-6 h-6 object-contain"
                    onError={(e) => (e.target.src = "/default-cart.png")}
                  />
                  <span className="text-sm font-medium hidden md:inline">Cart</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>

                {/* Wishlist Link */}
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-2 text-black hover:text-gray-700 transition duration-300"
                >
                  <img
                    src="/home/wishlist-icon.png"
                    alt="Wishlist"
                    className="w-6 h-6 object-contain"
                    onError={(e) => (e.target.src = "/default-wishlist.png")}
                  />
                  <span className="text-sm font-medium hidden md:inline">Wishlist</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-black hover:text-gray-700 z-20 transition duration-300"
                    aria-expanded={dropdownOpen}
                    aria-controls="profile-dropdown"
                  >
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 object-cover rounded-full"
                      onError={(e) => (e.target.src = "/default-profile.png")}
                    />
                    <span className="text-sm font-medium hidden md:inline">{fullName}</span>
                    <FaAngleDown className="text-sm" />
                  </button>
                  {dropdownOpen && (
                    <div
                      id="profile-dropdown"
                      className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50 border border-gray-200"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                      >
                        <img
                          src="/home/profile-icon.png"
                          alt="Profile Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-profile-icon.png")}
                        />
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/orders"
                        className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                      >
                        <img
                          src="/home/orders-icon.png"
                          alt="Orders Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-orders-icon.png")}
                        />
                        Orders
                      </Link>
                      <Link
                        to="/dashboard/tracking"
                        className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                      >
                        <img
                          src="/home/tracking-icon.png"
                          alt="Tracking Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-tracking-icon.png")}
                        />
                        Tracking
                      </Link>
                      <Link
                        to="/dashboard/support"
                        className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                      >
                        <img
                          src="/home/support-icon.png"
                          alt="Support Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-support-icon.png")}
                        />
                        Support
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-black hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                      >
                        <img
                          src="/home/settings-icon.png"
                          alt="Settings Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-settings-icon.png")}
                        />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left transition duration-300"
                      >
                        <img
                          src="/home/logout-icon.png"
                          alt="Logout Icon"
                          className="w-5 h-5 object-contain mr-2"
                          onError={(e) => (e.target.src = "/default-logout-icon.png")}
                        />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                < Link to="/login">
                  <button className="px-4 py-2 bg-transparent border-2 border-[#86d411] text-[#86d411] font-bold text-lg rounded-full hover:bg-[#6fb309] hover:text-white hover:border-[#6fb309] transition duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/customerregister">
                  <button className="px-4 py-2 bg-[#87de04] border-2 border-[#86d411] text-white font-bold text-lg rounded-full hover:bg-[#6fb309] transition duration-300 hover:border-[#6fb309]">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-4 pt-24">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight relative inline-block animate-slide-in-top">
              {slides[currentImage].title}
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
            </h1>
            <p className="text-lg mt-4 text-gray-200 animate-slide-in-left delay-100">
              {slides[currentImage].description}
            </p>
            <button
              className="mt-6 px-8 py-3 bg-[#87de04] text-white font-semibold rounded-full hover:border-2 hover:border-white hover:bg-transparent hover:border-transparent transition transform hover:scale-105 shadow-lg hover:shadow-green-100/00 animate-bounce-in delay-200"
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
                currentImage === index ? "bg-[#7ccc04] scale-125" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Category Slider Section */}
      <section className="bg-white py-6 shadow-lg">
        <div className="max-w-[868px] mx-auto px-4">
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={categorySliderRef}
              className="flex"
              style={{
                width: `${160 * categories.length * 2}px`,
              }}
            >
              {[...categories, ...categories].map((category, index) => (
                <Link
                  key={index}
                  to={`/shop?category=${category.name.toLowerCase()}`}
                  className="group flex flex-col items-center mx-6 flex-shrink-0 w-[120px] p-4 rounded-lg transition-all duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-label={`Select ${category.name} category`}
                >
                  <div
                    className="relative text-4xl mb-3 text-[#C3C5C0] group-hover:text-[#87de04] transition-all duration-300 cursor-pointer pointer-events-auto transform group-hover:scale-110 hover:text-green-600 hover:scale-110"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${category.name} category`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/shop?category=${category.name.toLowerCase()}`);
                      }
                    }}
                  >
                    {category.icon}
                  </div>
                  <span className="text-lg font-semibold text-[#A0A29D] group-hover:text-[#74C001] transition-all duration-300">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative text-center py-16 bg-white">
        <h2 className="text-3xl md:text-5xl font-bold text-[#66A901] animate-fade-in">
          Discover Aquatic Beauty
        </h2>
        <p className="text-gray-600 mt-2 animate-fade-in delay-100">
          Explore the serene allure of aquatic plants for your home or office
        </p>
        <div className="flex justify-center space-x-4 mt-8 animate-fade-in delay-200">
          <Link to="/customerregister">
            <button className="px-6 py-3 border-2 border-[#87de04] bg-[#87de04] text-white font-semibold rounded-md hover:bg-[#64A503] transition-all duration-300">
              Join us now
            </button>
          </Link>
          <Link to="/login">
            <button className="px-8 py-3 border-2 border-[#80D304] text-[#80D304] font-semibold rounded-md hover:bg-[#87de04] hover:text-white transition-all duration-300">
              Sign in
            </button>
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <video controls className="w-[800px] h-[450px] rounded-2xl shadow-2xl object-cover">
            <source src="/promo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gradient-to-b from-[#87de04] to-[#87de04] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">How It Works</h2>
        <p className="text-lg text-gray-100 mb-10 animate-fade-in delay-100">
          AquaPlants makes it easy to enhance your aquarium
        </p>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
            <div className="absolute -top-4 w-8 h-8 bg-[#66A901] text-white rounded-full flex items-center justify-center text-lg font-bold">
              1
            </div>
            <div className="text-5xl mb-3 text-[#80D205]">
              <FaShoppingBasket />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Your Plants</h3>
            <p className="text-sm text-gray-600">Browse our vibrant aquatic plants for your aquarium.</p>
          </div>
          <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
            <div className="absolute -top-4 w-8 h-8 bg-[#66A901] text-white rounded-full flex items-center justify-center text-lg font-bold">
              2
            </div>
            <div className="text-5xl mb-3 text-[#80D205]">
              <FaBoxOpen />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Place Your Order</h3>
            <p className="text-sm text-gray-600">Add plants to your cart and checkout securely.</p>
          </div>
          <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
            <div className="absolute -top-4 w-8 h-8 bg-[#66A901] text-white rounded-full flex items-center justify-center text-lg font-bold">
              3
            </div>
            <div className="text-5xl mb-3 text-[#80D205]">
              <FaTruck />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Fast Delivery</h3>
            <p className="text-sm text-gray-600">Receive fresh plants delivered to your door.</p>
          </div>
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
              <button className="px-5 py-2 text-sm rounded-full bg-green-100 text-green-800 border border-green-600 hover:bg-green-200 hover:scale-105 transition-all duration-300 mt-auto">
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
              isTransitioning ? "opacity-70 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              transform: `translateX(${isTransitioning ? "-10%" : "0"})`,
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
                  Math.floor(currentReviewIndex / 3) === index ? "bg-green-600 scale-125" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="bg-gradient-to-r from-[#7ccc04] to-[#7ccc04] text-white text-center p-8">
        <h3 className="text-2xl font-bold">Sign Up Today and Get 10% Off Your First Order!</h3>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-10 text-center border-t-4 border-[#7ccc04]">
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
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-l bg-gray-800 text-white w-full focus:outline-none"
              />
              <button className="bg-red-600 px-4 py-2 rounded-r text-white hover:bg-red-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <p className="mt-8">© 2025 AquaPlants. All rights reserved.</p>
        <button
          onClick={handleBackToTop}
          className="mt-4 p-3 bg-[#7ccc04] rounded-full text-white hover:bg-green-700 transition transform hover:scale-105"
        >
          <FaChevronUp />
        </button>
      </footer>
    </>
  );
};

export default Home;