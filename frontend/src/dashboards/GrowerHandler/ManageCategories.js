//// CRIPS\frontend\src\dashboards\GrowerHandler\ManageCategories.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grower-handler/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  // Handle edit button click
  const handleEdit = (category) => {
    setEditMode(category._id);
    setFormData({ name: category.name, description: category.description || "" });
  };

  // Handle form change during edit
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edited category
  const handleUpdate = async (id) => {
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/grower-handler/categories/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map((cat) => (cat._id === id ? response.data : cat)));
      setEditMode(null);
      setFormData({ name: "", description: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update category");
    }
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/grower-handler/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categories.filter((cat) => cat._id !== id));
        setError("");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete category");
      }
    }
  };

  // Navigate to Add Category page
  const handleAddCategory = () => {
    navigate("/grower-handler/add-category");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <GHSidebar />
      <div className="flex-1 flex flex-col">
        <GHNavbar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
              <button
                onClick={handleAddCategory}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <span className="mr-2 text-xl">+</span> Add Category
              </button>
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {loading ? (
              <p className="text-center">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-center">No categories found.</p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b">
                      {editMode === category._id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full p-1 border rounded"
                              required
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              className="w-full p-1 border rounded"
                            />
                          </td>
                          <td className="p-3">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleUpdate(category._id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditMode(null)}
                              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">{category.name}</td>
                          <td className="p-3">{category.description || "-"}</td>
                          <td className="p-3">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleEdit(category)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;