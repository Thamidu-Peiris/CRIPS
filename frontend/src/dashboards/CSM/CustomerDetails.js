import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";
import { FaUser, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaPhone, FaIdCard } from "react-icons/fa";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    address: "",
    phoneNumber: "",
    businessAddress: "",
    taxId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "Customer Service Manager") {
      navigate("/login");
      return;
    }

    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/csm/customers/approved`);
        const customerData = response.data.find(c => c._id === customerId);
        if (!customerData) {
          throw new Error("Customer not found");
        }
        setCustomer(customerData);
        setFormData({
          firstName: customerData.firstName || "",
          lastName: customerData.lastName || "",
          email: customerData.email || "",
          companyName: customerData.companyName || "",
          address: customerData.address || "",
          phoneNumber: customerData.phoneNumber || "",
          businessAddress: customerData.businessAddress || "",
          taxId: customerData.taxId || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Failed to load customer details. Please try again.");
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [customerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/csm/customers/${customerId}`, formData);
      setSuccess("Customer details updated successfully!");
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/csm/customers/approved`);
      const updatedCustomer = response.data.find(c => c._id === customerId);
      setCustomer(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      setError("Failed to update customer details. Please try again.");
      setSuccess(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <CSMSidebar />
        <main className="flex-1 p-6">
          <CSMNavbar />
          <div className="text-center text-gray-500 text-lg mt-16">
            <p>Loading...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <CSMSidebar />
        <main className="flex-1 p-6">
          <CSMNavbar />
          <div className="max-w-4xl mx-auto mt-16 p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-md">
            {error}
          </div>
        </main>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <CSMSidebar />
        <main className="flex-1 p-6">
          <CSMNavbar />
          <div className="max-w-4xl mx-auto mt-16 p-6 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg shadow-md">
            Customer not found.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      <CSMSidebar />
      <main className="flex-1 p-4 lg:p-8">
        <CSMNavbar />
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-tight text-center">
            
          </h2>

          

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-md transition-all duration-300">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-md transition-all duration-300">
              {error}
            </div>
          )}

          {/* Customer Details Form */}
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">First Name</label>
                  <div className="mt-1 relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Last Name</label>
                  <div className="mt-1 relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Email</label>
                  <div className="mt-1 relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Company Name</label>
                  <div className="mt-1 relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Address</label>
                  <div className="mt-1 relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Phone Number</label>
                  <div className="mt-1 relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Business Address</label>
                  <div className="mt-1 relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Tax ID</label>
                  <div className="mt-1 relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="pl-10 p-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4 justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/csm/customers-list")}
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                  Back to List
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetails;