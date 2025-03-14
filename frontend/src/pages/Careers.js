import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
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

  const jobOptions = [
    "Customer Service Manager",
    "Grower Handler",
    "Cutters",
    "Inventory Manager",
    "Sales Manager",
  ];

  const handleApplyClick = () => {
    if (selectedJob) {
      setIsPopupOpen(true);
    } else {
      alert("Please select a job position before applying.");
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
    if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/jobs/apply", {
        jobTitle: selectedJob,
        ...formData,
      });

      alert(response.data.message);
      setIsPopupOpen(false);
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-6">Join Our Team</h1>

        {/* Job Selection Dropdown */}
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
          <button onClick={handleApplyClick} className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Apply Now
          </button>
        </div>

        {/* Employee Login Button */}
        <div className="text-center mt-10">
          <Link to="/employee-login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
            Employee Login
          </Link>
        </div>
      </div>

      {/* Apply Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Apply for {selectedJob}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" onChange={handleChange} placeholder="First Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="username" onChange={handleChange} placeholder="Username" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="address" onChange={handleChange} placeholder="Address" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="phoneNumber" onChange={handleChange} placeholder="Phone Number" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="email" onChange={handleChange} placeholder="Email" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="password" type="password" onChange={handleChange} placeholder="Password" className="p-3 border rounded-lg bg-gray-100" required />
                <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm Password" className="p-3 border rounded-lg bg-gray-100" required />
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="mt-4 flex items-center">
                <input type="checkbox" name="termsAccepted" onChange={handleChange} className="w-4 h-4 text-green-500" required />
                <label className="ml-2 text-gray-700">I agree to all the Terms and Privacy Policy</label>
              </div>

              {/* Submit & Close Buttons */}
              <div className="flex justify-between mt-6">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Submit Application
                </button>
                <button onClick={() => setIsPopupOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Careers;
