import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Customers");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirmPassword
    companyName: "",
    businessAddress: "",
    taxId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("role", role);
    for (const key in formData) {
      if (key !== "confirmPassword") { // Exclude confirmPassword from backend submission
        formDataToSend.append(key, formData[key]);
      }
    }
    if (selectedFile) {
      formDataToSend.append("profileImage", selectedFile);
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("User registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user");
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
          <Link to="/Careers" className="text-gray-600">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        <div className="space-x-4">
          <Link to="/customerregister" className="border px-4 py-2 rounded text-green-600">
            Sign Up
          </Link>
          <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded">
            Login
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Create a New Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring focus:ring-green-200"
              >
                <option value="Customers">Customers</option>
                <option value="Wholesale Dealers">Wholesale Dealers</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-3 border rounded-lg bg-gray-100"
              />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 rounded-full object-cover" />
              )}
            </div>

            {role === "Customers" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input name="firstName" onChange={handleChange} placeholder="First Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="username" onChange={handleChange} placeholder="Username" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="address" onChange={handleChange} placeholder="Address" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="email" onChange={handleChange} placeholder="Email" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="password" onChange={handleChange} placeholder="Password" type="password" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" type="password" className="p-3 border rounded-lg bg-gray-100" required /> {/* Added Confirm Password */}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input name="companyName" onChange={handleChange} placeholder="Company Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="firstName" onChange={handleChange} placeholder="First Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="username" onChange={handleChange} placeholder="Username" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="businessAddress" onChange={handleChange} placeholder="Business Address" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="taxId" onChange={handleChange} placeholder="Tax ID" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="email" onChange={handleChange} placeholder="Email" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="password" onChange={handleChange} placeholder="Password" type="password" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="confirmPassword" onChange={handleChange} placeholder="Confirm Password" type="password" className="p-3 border rounded-lg bg-gray-100" required /> {/* Added Confirm Password */}
              </div>
            )}

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-300">
              Register
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="text-green-600 font-bold">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;