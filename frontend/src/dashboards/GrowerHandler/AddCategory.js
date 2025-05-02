// frontend\src\dashboards\GrowerHandler\AddCategory.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars } from "react-icons/fa"; // Import hamburger icon
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const AddCategory = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name) {
      setError("Category name is required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/grower-handler/categories",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Category added successfully!");
      setFormData({ name: "", description: "" });
      setTimeout(() => navigate("/grower-handler/manage-categories"), 2000); // Redirect to ManageCategories
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add category");
    }
  };

  // Navigate to Manage Categories page
  const handleViewCategories = () => {
    navigate("/grower-handler/manage-categories");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <GHSidebar />
      <div className="flex-1 flex flex-col">
        <GHNavbar />
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add Category</h2>
              <button
                onClick={handleViewCategories}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FaBars className="mr-2" /> Categories
              </button>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Aquatic Plants"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter a brief description"
                  rows="4"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-200"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;