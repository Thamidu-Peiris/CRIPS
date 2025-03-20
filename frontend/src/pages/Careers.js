// CRIPS\frontend\src\pages\Careers.js (already updated in previous response)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    firstName: "",
    lastName: "",
    username: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const navigate = useNavigate();

  const jobOptions = [
    "Customer Service Manager",
    "Grower Handler",
    "Cutters",
    "Inventory Manager",
    "Sales Manager",
  ];

  const handleApplyClick = () => {
    if (selectedJob) {
      setFormData({ ...formData, jobTitle: selectedJob });
      setIsPopupOpen(true);
    } else {
      alert("Please select a job position to apply for.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.termsAccepted) {
      alert("Please accept the Terms and Privacy Policy.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/jobs/apply", formData);
      if (response.data.success) {
        alert("Application submitted successfully!");
        setIsPopupOpen(false);
        setFormData({
          jobTitle: "",
          firstName: "",
          lastName: "",
          username: "",
          address: "",
          phoneNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
          termsAccepted: false,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-gray-600 font-bold">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
        </div>
        {JSON.parse(localStorage.getItem("userInfo")) ? (
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

      <div className="text-gray-500 mb-4 p-6">
        <Link to="/" className="hover:underline">Home</Link> / Careers
      </div>

      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-6">Join Our Team</h1>

        <div className="text-center mb-6">
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="p-3 border rounded-lg bg-gray-100"
          >
            <option value="">Select a Job Position</option>
            {jobOptions.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
          <button
            onClick={handleApplyClick}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Apply Now
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Apply for {selectedJob}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  onChange={handleChange}
                  placeholder="First Name"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="username"
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="address"
                  onChange={handleChange}
                  placeholder="Address"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="phoneNumber"
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="email"
                  onChange={handleChange}
                  placeholder="Email"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
                <input
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="p-3 border rounded-lg bg-gray-100"
                  required
                />
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500"
                  required
                />
                <label className="ml-2 text-gray-700">I agree to all the Terms and Privacy Policy</label>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;