import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/jobs/login", formData);
      if (response.data.success) {
        localStorage.setItem("employeeInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userId", response.data.user.id); // ✅ Store userId separately
  
        console.log("✅ User ID Stored:", response.data.user.id); // Debugging Log
  
        // ✅ Redirect based on role
        switch (response.data.user.role) {
          case "Customer Service Manager":
            navigate("/customer-service-dashboard");
            break;
          case "Grower Handler":
            navigate("/grower-handler-dashboard");
            break;
          case "Cutters":
            navigate("/cutters-dashboard");
            break;
          case "Inventory Manager":
            navigate("/inventory-manager-dashboard");
            break;
          case "Sales Manager":
            navigate("/sales-manager-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("❌ Login Error:", error.response ? error.response.data : error.message); // Debugging Log
    }
  };
  

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Employee Login</h2>
          {error && <p className="text-red-600 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeLogin;
