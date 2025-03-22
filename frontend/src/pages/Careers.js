// frontend/src/pages/Careers.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";

const Careers = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    firstName: "",
    lastName: "",
    username: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    startDate: "",
    coverLetter: null,
    resume: null,
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const mockJobs = [
    {
      title: "Customer Service Manager",
      description: "Handle customer inquiries and ensure satisfaction in our aqua plant export business.",
    },
    {
      title: "Grower Handler",
      description: "Oversee the growth and care of aqua plants for export.",
    },
    {
      title: "Cutters",
      description: "Assist in the preparation and packaging of aqua plants.",
    },
    {
      title: "Inventory Manager",
      description: "Manage stock levels and ensure timely delivery of aqua plants.",
    },
    {
      title: "Sales Manager",
      description: "Drive sales and build relationships with clients in the aqua plant industry.",
    },
  ];

  const handleApplyClick = (jobTitle) => {
    setSelectedJob(jobTitle);
    setFormData({ ...formData, jobTitle });
    setIsPopupOpen(true);
    setError("");
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleClear = () => {
    setFormData({
      jobTitle: selectedJob,
      firstName: "",
      lastName: "",
      username: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      startDate: "",
      coverLetter: null,
      resume: null,
      termsAccepted: false,
    });
    setError("");
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    // Client-side validation for startDate
    const today = new Date();
    const selectedStartDate = new Date(formData.startDate);
    if (selectedStartDate <= today) {
      setError("Start date must be in the future");
      setIsSubmitting(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Validate terms acceptance
    if (!formData.termsAccepted) {
      setError("Please accept the Terms and Privacy Policy");
      setIsSubmitting(false);
      return;
    }

    // Construct FormData
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Log FormData for debugging in a readable format
    console.log("Submitting FormData:");
    const formDataEntries = {};
    for (let pair of formDataToSend.entries()) {
      formDataEntries[pair[0]] = pair[1];
    }
    console.table(formDataEntries);

    try {
      const response = await axios.post("http://localhost:5000/api/jobs/apply", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        alert("Application submitted successfully! Awaiting admin approval. You can check your application status.");
        setIsPopupOpen(false);
        handleClear();
        navigate("/check-status");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please check your input and try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-5 bg-white shadow-md">
        <div className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
          CRIPS
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-green-600 font-medium">Home</Link>
          <Link to="/shop" className="text-gray-600">Shop</Link>
          <Link to="/careers" className="text-green-600 font-bold">Careers</Link>
          <Link to="/about" className="text-gray-600">About</Link>
          <Link to="/contact" className="text-gray-600">Contact Us</Link>
          <Link to="/check-status" className="text-gray-600">Check Status</Link>
        </div>
        <CustomerHeader />
      </nav>

      {/* Breadcrumb */}
      <div className="text-gray-500 mb-4 p-6">
        <Link to="/">Home</Link> / Careers
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-10">Join Our Team at CRIPS</h1>
        <p className="text-center text-gray-600 mb-12">
          Be a part of our mission to bring the beauty of aqua plants to the world. Explore exciting career opportunities below!
        </p>

        {/* Job Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-green-600 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <button
                onClick={() => handleApplyClick(job.title)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Employee Application - {selectedJob}
            </h2>
            {/* Display error message prominently */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">First Name *</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Name *</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Username *</label>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number *</label>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1 *</label>
                    <input
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Address Line 1"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                    <input
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Address Line 2 (Optional)"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">City *</label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">State *</label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code *</label>
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">UK</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Application Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">When can you start? *</label>
                    <input
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cover Letter</label>
                    <input
                      name="coverLetter"
                      type="file"
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Resume *</label>
                    <input
                      name="resume"
                      type="file"
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password *</label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password *</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500 focus:ring-green-500"
                  required
                />
                <label className="ml-2 text-gray-700">
                  I agree to all the <Link to="/terms" className="text-green-600 hover:underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
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