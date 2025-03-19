import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CustomerHeader from '../components/CustomerHeader'; // Adjust the path based on your structure

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call universal login API instead of /users/login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        emailOrUsername: formData.email,
        password: formData.password
      });
      
      
      // ✅ Save full user info including role
      localStorage.setItem('userInfo', JSON.stringify(response.data));

      // ✅ Redirect based on role
      const role = response.data.role;
      if (role === "SystemManager") navigate("../sm-dashboard");
      else if (role === "Customers") navigate("/shop");
      else if (role === "Employee") navigate("/employee/dashboard");
      else navigate("/admin/dashboard");

    } catch (error) {
      console.error("Error logging in:", error);
      alert('Login failed. Please check your credentials.');
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
        {/* 🔹 Customer Header */}
        <CustomerHeader />
      </nav>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Customer Login</h2>
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
          <p className="text-center mt-4">
            Don't have an account? <Link to="/customerregister" className="text-green-600">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
