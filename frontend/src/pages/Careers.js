import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "../components/CustomerHeader";
import { FaUserTie, FaTruck, FaBox, FaLeaf, FaCut, FaDollarSign, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";

// Function to generate a random username
const generateUsername = (firstName, lastName) => {
  const symbols = ["#", "@", "$", "%", "&"];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomNumbers = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${firstName}${lastName}${randomSymbol}${randomNumbers}`.replace(/\s/g, "");
};

// Function to generate a strong 12-character password
const generatePassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const Careers = () => {
  const [vacancies, setVacancies] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSupplierPopupOpen, setIsSupplierPopupOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [formData, setFormData] = useState({
    jobTitle: "",
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    email: "",
    startDate: "",
    coverLetter: null,
    resume: null,
    termsAccepted: false,
    role: "",
  });
  const [supplierFormData, setSupplierFormData] = useState({
    NIC: "",
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    username: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    supplies: [{ itemType: "", description: "", quantity: "", unit: "", photo: null }],
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [supplierError, setSupplierError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSupplierSubmitting, setIsSupplierSubmitting] = useState(false);

  const navigate = useNavigate();

  // Job role icons mapping
  const jobIcons = {
    "Customer Service Manager": <FaUserTie className="text-green-600 text-3xl mb-2" />,
    "Grower Handler": <FaLeaf className="text-green-600 text-3xl mb-2" />,
    "Cutters": <FaCut className="text-green-600 text-3xl mb-2" />,
    "Inventory Manager": <FaBox className="text-green-600 text-3xl mb-2" />,
    "Sales Manager": <FaDollarSign className="text-green-600 text-3xl mb-2" />,
    "Transport Manager": <FaTruck className="text-green-600 text-3xl mb-2" />,
  };

  // Role to background image mapping
  const roleImageMap = {
    "Customer Service Manager": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "Grower Handler": "https://i.pinimg.com/736x/c4/bc/32/c4bc324d97e3ff9a451fe8daab0aa4e8.jpg",
    "Cutters": "https://i.pinimg.com/736x/e3/9f/33/e39f33421c80a4535bd068be081d3417.jpg",
    "Inventory Manager": "https://i.pinimg.com/736x/e7/e5/ee/e7e5eeab4a5dade8ed036bef6a631398.jpg",
    "Sales Manager": "https://i.pinimg.com/736x/a9/6a/49/a96a49314288260dd3e7017876ae3c63.jpg",
    "Transport Manager": "https://i.pinimg.com/736x/68/7a/3a/687a3a7a2ac8031e5cd476a73a598d70.jpg",
  };

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vacancies');
        const updatedVacancies = response.data.map(vacancy => ({
          ...vacancy,
          backgroundImage: vacancy.backgroundImage || roleImageMap[vacancy.title] || '',
        }));
        setVacancies(updatedVacancies);
      } catch (error) {
        console.error('Failed to fetch vacancies:', error);
      }
    };
    fetchVacancies();
  }, []);

  const handleApplyClick = (jobTitle) => {
    setSelectedJob(jobTitle);
    setFormData({ ...formData, jobTitle, role: jobTitle });
    setIsPopupOpen(true);
    setError("");
    setIsSubmitting(false);
  };

  const handleBecomeSupplierClick = () => {
    setIsSupplierPopupOpen(true);
    setSupplierError("");
    setIsSupplierSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSupplierChange = (e, index) => {
    const { name, value, type, checked, files } = e.target;
    if (name.startsWith("supplies")) {
      const field = name.split(".")[1];
      const updatedSupplies = [...supplierFormData.supplies];
      updatedSupplies[index] = {
        ...updatedSupplies[index],
        [field]: type === "file" ? files[0] : value,
      };
      setSupplierFormData({ ...supplierFormData, supplies: updatedSupplies });
    } else {
      setSupplierFormData({
        ...supplierFormData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddSupplyItem = () => {
    setSupplierFormData({
      ...supplierFormData,
      supplies: [...supplierFormData.supplies, { itemType: "", description: "", quantity: "", unit: "", photo: null }],
    });
  };

  const handleRemoveSupplyItem = (index) => {
    const updatedSupplies = supplierFormData.supplies.filter((_, i) => i !== index);
    setSupplierFormData({ ...supplierFormData, supplies: updatedSupplies });
  };

  const handleClear = () => {
    setFormData({
      jobTitle: selectedJob,
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      email: "",
      startDate: "",
      coverLetter: null,
      resume: null,
      termsAccepted: false,
      role: selectedJob,
    });
    setError("");
    setIsSubmitting(false);
  };

  const handleSupplierClear = () => {
    setSupplierFormData({
      NIC: "",
      name: "",
      companyName: "",
      contactNumber: "",
      email: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      supplies: [{ itemType: "", description: "", quantity: "", unit: "", photo: null }],
      termsAccepted: false,
    });
    setSupplierError("");
    setIsSupplierSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    const today = new Date();
    const selectedStartDate = new Date(formData.startDate);
    if (selectedStartDate <= today) {
      setError("Start date must be in the future");
      setIsSubmitting(false);
      return;
    }

    if (!formData.termsAccepted) {
      setError("Please accept the Terms and Privacy Policy");
      setIsSubmitting(false);
      return;
    }

    // Generate username and password
    const username = generateUsername(formData.firstName, formData.lastName);
    const password = generatePassword();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    }
    formDataToSend.append("username", username);
    formDataToSend.append("password", password);

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

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    if (isSupplierSubmitting) return;
    setSupplierError("");
    setIsSupplierSubmitting(true);

    if (!supplierFormData.termsAccepted) {
      setSupplierError("Please accept the Terms and Privacy Policy");
      setIsSupplierSubmitting(false);
      return;
    }

    if (supplierFormData.password.length < 8) {
      setSupplierError("Password must be at least 8 characters long");
      setIsSupplierSubmitting(false);
      return;
    }

    for (const supply of supplierFormData.supplies) {
      if (!supply.itemType || !supply.quantity || !supply.unit || !supply.photo) {
        setSupplierError("All supply items must have an item type, quantity, unit, and photo");
        setIsSupplierSubmitting(false);
        return;
      }
    }

    const supplierFormDataToSend = new FormData();
    supplierFormDataToSend.append("NIC", supplierFormData.NIC);
    supplierFormDataToSend.append("name", supplierFormData.name);
    supplierFormDataToSend.append("companyName", supplierFormData.companyName);
    supplierFormDataToSend.append("contactNumber", supplierFormData.contactNumber);
    supplierFormDataToSend.append("email", supplierFormData.email);
    supplierFormDataToSend.append("username", supplierFormData.username);
    supplierFormDataToSend.append("password", supplierFormData.password);
    const address = `${supplierFormData.addressLine1}${supplierFormData.addressLine2 ? ", " + supplierFormData.addressLine2 : ""}, ${supplierFormData.city}, ${supplierFormData.state}, ${supplierFormData.postalCode}, ${supplierFormData.country}`;
    supplierFormDataToSend.append("address", address);
    supplierFormData.supplies.forEach((supply, index) => {
      supplierFormDataToSend.append(`supplies[${index}][itemType]`, supply.itemType);
      supplierFormDataToSend.append(`supplies[${index}][description]`, supply.description || "");
      supplierFormDataToSend.append(`supplies[${index}][quantity]`, supply.quantity);
      supplierFormDataToSend.append(`supplies[${index}][unit]`, supply.unit);
      supplierFormDataToSend.append(`supplies[${index}][photo]`, supply.photo);
    });
    supplierFormDataToSend.append("termsAccepted", supplierFormData.termsAccepted);

    console.log("Submitting Supplier FormData:");
    const formDataEntries = {};
    for (let pair of supplierFormDataToSend.entries()) {
      formDataEntries[pair[0]] = pair[1];
    }
    console.table(formDataEntries);

    try {
      const response = await axios.post("http://localhost:5000/api/suppliers/register", supplierFormDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        alert("Supplier registration submitted successfully! Awaiting admin approval.");
        setIsSupplierPopupOpen(false);
        handleSupplierClear();
        navigate("/check-status");
      }
    } catch (error) {
      console.error("Error submitting supplier registration:", error);
      console.log("Error response:", error.response);
      const errorMessage = error.response?.data?.message || "Failed to submit supplier registration. Please check your input and try again.";
      setSupplierError(errorMessage);
    } finally {
      setIsSupplierSubmitting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-teal-50 to-blue-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="h-12 transition-transform hover:scale-110"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 font-medium text-lg hover:text-gray-900 transition relative group"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
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
            className="text-green-700 font-bold text-lg hover:text-[#7ccc04] transition relative group"
          >
            Careers
            <span className="absolute left-0 bottom-0 w-full h-[4px] bg-[#87de04] scale-x-100 transition-transform duration-300"></span>
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
        {vacancies.length === 0 ? (
          <div className="text-center text-gray-600">
            No job vacancies available at the moment. Please check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vacancies.map((job, index) => (
              <div
                key={index}
                className="relative bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                style={{
                  backgroundImage: job.backgroundImage ? `url(${job.backgroundImage})` : 'none',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 text-center">
                  {jobIcons[job.title] || <FaBriefcase className="text-green-600 text-3xl mb-2" />}
                  <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                  <p className="text-gray-200 mb-4">{job.description}</p>
                  <button
                    onClick={() => handleApplyClick(job.title)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Supplier Section */}
        <div className="text-center mt-12 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center mb-4">
            <FaBox className="text-green-600 text-4xl" />
          </div>
          <p className="text-center text-gray-600 mb-6">
            <span className="font-semibold text-green-700">We are also looking for trusted suppliers</span> to provide essential materials such as cups, specialized media (soil), fertilizers, and high-quality aqua plant seeds to support our growing export operations.
          </p>
          <button
            onClick={handleBecomeSupplierClick}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Become a Supplier
          </button>
        </div>
      </div>

      {/* Employee Application Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Employee Application - {selectedJob}
            </h2>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>
              </div>

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

      {/* Supplier Registration Popup Form */}
      {isSupplierPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
              Supplier Registration
            </h2>
            {supplierError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p className="font-semibold">Error:</p>
                <p>{supplierError}</p>
              </div>
            )}
            <form onSubmit={handleSupplierSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Supplier Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">NIC *</label>
                    <input
                      name="NIC"
                      value={supplierFormData.NIC}
                      onChange={handleSupplierChange}
                      placeholder="Supplier NIC"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
                    <input
                      name="name"
                      value={supplierFormData.name}
                      onChange={handleSupplierChange}
                      placeholder="Full Name"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                    <input
                      name="companyName"
                      value={supplierFormData.companyName}
                      onChange={handleSupplierChange}
                      placeholder="Company Name (Optional)"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={supplierFormData.email}
                      onChange={handleSupplierChange}
                      placeholder="Email"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number *</label>
                    <input
                      name="contactNumber"
                      value={supplierFormData.contactNumber}
                      onChange={handleSupplierChange}
                      placeholder="Contact Number"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 1 *</label>
                    <input
                      name="addressLine1"
                      value={supplierFormData.addressLine1}
                      onChange={handleSupplierChange}
                      placeholder="Address Line 1"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address Line 2</label>
                    <input
                      name="addressLine2"
                      value={supplierFormData.addressLine2}
                      onChange={handleSupplierChange}
                      placeholder="Address Line 2 (Optional)"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">City *</label>
                      <input
                        name="city"
                        value={supplierFormData.city}
                        onChange={handleSupplierChange}
                        placeholder="City"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">State *</label>
                      <input
                        name="state"
                        value={supplierFormData.state}
                        onChange={handleSupplierChange}
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
                        value={supplierFormData.postalCode}
                        onChange={handleSupplierChange}
                        placeholder="Postal Code"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Country *</label>
                      <select
                        name="country"
                        value={supplierFormData.country}
                        onChange={handleSupplierChange}
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

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Setup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Username *</label>
                    <input
                      name="username"
                      value={supplierFormData.username}
                      onChange={handleSupplierChange}
                      placeholder="Username"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password *</label>
                    <input
                      name="password"
                      type="password"
                      value={supplierFormData.password}
                      onChange={handleSupplierChange}
                      placeholder="Password"
                      className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Supplies</h3>
                {supplierFormData.supplies.map((supply, index) => (
                  <div key={index} className="border p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Item Type *</label>
                        <select
                          name={`supplies[${index}].itemType`}
                          value={supply.itemType}
                          onChange={(e) => handleSupplierChange(e, index)}
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="">Select Item Type</option>
                          <option value="Seed">Seed</option>
                          <option value="Fertilizer">Fertilizer</option>
                          <option value="Cups">Cups</option>
                          <option value="Media">Media</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                        <input
                          name={`supplies[${index}].description`}
                          value={supply.description}
                          onChange={(e) => handleSupplierChange(e, index)}
                          placeholder="Description (Optional)"
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
                        <input
                          name={`supplies[${index}].quantity`}
                          type="number"
                          value={supply.quantity}
                          onChange={(e) => handleSupplierChange(e, index)}
                          placeholder="Quantity"
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Unit *</label>
                        <input
                          name={`supplies[${index}].unit`}
                          value={supply.unit}
                          onChange={(e) => handleSupplierChange(e, index)}
                          placeholder="Unit (e.g., kg, bags)"
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Photo of Item *</label>
                        <input
                          name={`supplies[${index}].photo`}
                          type="file"
                          onChange={(e) => handleSupplierChange(e, index)}
                          className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    {supplierFormData.supplies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSupplyItem(index)}
                        className="mt-2 text-red-500 hover:underline"
                      >
                        Remove Item
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSupplyItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Add Another Item
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={supplierFormData.termsAccepted}
                  onChange={handleSupplierChange}
                  className="w-4 h-4 text-green-500 focus:ring-green-500"
                  required
                />
                <label className="ml-2 text-gray-700">
                  I agree to all the <Link to="/terms" className="text-green-600 hover:underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  disabled={isSupplierSubmitting}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
                    isSupplierSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                  }`}
                >
                  {isSupplierSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
                <button
                  type="button"
                  onClick={handleSupplierClear}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsSupplierPopupOpen(false)}
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