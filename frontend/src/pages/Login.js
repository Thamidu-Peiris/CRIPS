// CRIPS\frontend\src\pages\Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
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

      // Store user info, userId, role, and token in localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("token", response.data.token);
      const role = response.data.role || ""; // Keep the role as-is (do not lowercase)
      localStorage.setItem("role", role);

      console.log("[DEBUG] Stored in localStorage:");
      console.log("  userId:", localStorage.getItem("userId"));
      console.log("  token:", localStorage.getItem("token"));
      console.log("  role:", localStorage.getItem("role"));
      console.log("  userInfo:", localStorage.getItem("userInfo"));

      // Role-based redirection
      if (role === "SystemManager") {
        console.log("[DEBUG] Redirecting to /sm-dashboard");
        navigate("/sm-dashboard");
      } else if (role === "Customer Service Manager") {
        console.log("[DEBUG] Redirecting to /customer-service-dashboard");
        navigate("/customer-service-dashboard");
      } else if (role === "grower handler") {
        console.log("[DEBUG] Redirecting to /grower-handler-dashboard");
        navigate("/grower-handler-dashboard");
      } else if (role === "cutters") {
        console.log("[DEBUG] Redirecting to /cutters-dashboard");
        navigate("/cutters-dashboard");
      } else if (role === "InventoryManager") {
        console.log("[DEBUG] Redirecting to /inventory-manager-dashboard");
        navigate("/inventory-manager-dashboard");
      } else if (role === "sales manager") {
        console.log("[DEBUG] Redirecting to /sales-manager-dashboard");
        navigate("/sales-manager-dashboard");
      } else {
        console.log("[DEBUG] Redirecting to /shop (default for Customer)");
        navigate("/shop");
      }
    } catch (error) {
      console.error("[DEBUG] Error logging in:", error.response?.data || error.message);
      console.error("[DEBUG] Error status:", error.response?.status);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="font-sans">
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

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="emailOrUsername"
              placeholder="Email or Username"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 mb-4"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-100 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account? <Link to="/customerregister" className="text-green-600">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;