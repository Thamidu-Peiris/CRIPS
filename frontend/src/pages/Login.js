import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import CustomerHeader from "../components/CustomerHeader";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("[DEBUG] Submitting login request with:", formData);
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      console.log("[DEBUG] Login response:", response.data);

      // Check if login is successful and user status (if provided)
      const user = response.data.user;
      if (user && (user.role === "Customers" || user.role === "Wholesale Dealers")) {
        // Temporary frontend check until backend enforces status
        if (user.status && user.status.toLowerCase() !== "approved") {
          throw new Error(`Your account is ${user.status}. Please wait for approval or contact support if declined.`);
        }
      }

      // Store user info, userId, role, and token in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("token", response.data.token);
      const role = response.data.role || "";
      localStorage.setItem("role", role);

      console.log("[DEBUG] Stored in localStorage:");
      console.log("  userId:", localStorage.getItem("userId"));
      console.log("  token:", localStorage.getItem("token"));
      console.log("  role:", localStorage.getItem("role"));
      console.log("  userInfo:", localStorage.getItem("userInfo"));

      // Set success message and redirect
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage("");

      // Role-based redirection
      if (role === "SystemManager") {
        console.log("[DEBUG] Redirecting to /sm-dashboard");
        navigate("/sm-dashboard");
      } else if (role === "Customer Service Manager") {
        console.log("[DEBUG] Redirecting to /csm/dashboard");
        navigate("/csm/dashboard");
      } else if (role === "Grower Handler") {
        console.log("[DEBUG] Redirecting to /grower-handler-dashboard");
        navigate("/dashboards/GrowerHandler");
      } else if (role === "Cutters") {
        console.log("[DEBUG] Redirecting to /cutters-dashboard");
        navigate("/cutters-dashboard");
      } else if (role === "TransportManager") {
        console.log("[DEBUG] Redirecting to /TM-dashboard");
        navigate("/transport-dashboard");
      } else if (role === "supplier") {
        console.log("[DEBUG] Redirecting to /supplier-dashboard");
        navigate("/supplier-dashboard");
      } else if (role === "InventoryManager") {
        console.log("[DEBUG] Redirecting to /inventory-manager-dashboard");
        navigate("/inventory-manager-dashboard");
      } else if (role === "Sales Manager") {
        console.log("[DEBUG] Redirecting to /sales-manager-dashboard");
        navigate("/sales-manager-dashboard");
      } else if (role === "Customers" || role === "Wholesale Dealers") {
        console.log("[DEBUG] Redirecting to /shop");
        navigate("/shop");
      } else {
        console.log("[DEBUG] Redirecting to /shop (default for Customer)");
        navigate("/shop");
      }
    } catch (error) {
      console.error("[DEBUG] Error logging in:", error.response?.data || error.message);
      console.error("[DEBUG] Error status:", error.response?.status);
      // Prioritize thrown error message, then server message, then fallback
      const message = error.message?.includes("Your account is")
        ? error.message
        : error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.";
      setErrorMessage(message);
      setSuccessMessage("");
    }
  };

  return (
    <div
      className="font-sans min-h-screen bg-gradient-to-b from-green-50/80 to-white/80 bg-cover bg-center"
      style={{
        backgroundImage: `url('/loginbg.jpg')`, // Ensure this image is in frontend/public/loginbg.jpg
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/shop" className="text-green-700 font-bold text-lg hover:text-[#7ccc04] transition relative group">
            Shop
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/careers" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/about" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            About
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
          <Link to="/contact" className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group">
            Contact Us
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Login Content */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30"
        >
          <h2 className="text-4xl font-bold text-center text-green-800 mb-8">Login</h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Email or Username"
                onChange={handleChange}
                className="w-full p-4 bg-white/30 backdrop-blur-sm rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-4 bg-white/30 backdrop-blur-sm rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
                required
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-[#87de04] text-white py-4 rounded-full font-medium text-lg hover:bg-[#7ccc04] transition-all shadow-lg"
            >
              Login
            </motion.button>
          </form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-white/90 text-lg"
          >
            Don't have an account?{" "}
            <Link
              to="/customerregister"
              className="text-gray-700 hover:text-gray-800 font-bold text-lg transition relative group"
            >
              Register here
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;