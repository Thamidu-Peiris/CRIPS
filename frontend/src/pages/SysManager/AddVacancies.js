import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../dashboards/SM/sideBar';
import { FaBriefcase } from 'react-icons/fa';

export default function AddVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [newVacancy, setNewVacancy] = useState({ title: '', description: '', backgroundImage: '' });
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteVacancyId, setDeleteVacancyId] = useState(null);

  // Predefined career opportunities
  const careerOptions = [
    "Customer Service Manager",
    "Grower Handler",
    "Cutters",
    "Inventory Manager",
    "Sales Manager",
    "Transport Manager",
  ];

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
    fetchVacancies();
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return {};
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchVacancies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/vacancies', getAuthHeaders());
      setVacancies(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch vacancies. Please try again later.';
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You must be a System Manager to view vacancies.');
      } else {
        setError(errorMessage);
      }
      console.error('Failed to fetch vacancies:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (vacancy) => {
    const errors = {};
    if (!vacancy.title) {
      errors.title = 'Job Title is required';
    }
    if (!vacancy.description.trim()) {
      errors.description = 'Description is required';
    }
    return errors;
  };

  const handleAddVacancy = async () => {
    const validationErrors = validateForm(newVacancy);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      // Set the background image based on the selected role
      const vacancyWithImage = {
        ...newVacancy,
        backgroundImage: roleImageMap[newVacancy.title] || '',
      };
      await axios.post('http://localhost:5000/api/vacancies', vacancyWithImage, getAuthHeaders());
      setSuccessMessage('Vacancy added successfully!');
      setNewVacancy({ title: '', description: '', backgroundImage: '' });
      setFormErrors({});
      fetchVacancies();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add vacancy. Please try again.';
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You must be a System Manager to add vacancies.');
      } else {
        setError(errorMessage);
      }
      console.error('Failed to add vacancy:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVacancy = async () => {
    const validationErrors = validateForm(editingVacancy);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      // Set the background image based on the selected role
      const vacancyWithImage = {
        ...editingVacancy,
        backgroundImage: roleImageMap[editingVacancy.title] || '',
      };
      await axios.put(`http://localhost:5000/api/vacancies/${editingVacancy._id}`, vacancyWithImage, getAuthHeaders());
      setSuccessMessage('Vacancy updated successfully!');
      setEditingVacancy(null);
      setFormErrors({});
      fetchVacancies();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update vacancy. Please try again.';
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You must be a System Manager to update vacancies.');
      } else {
        setError(errorMessage);
      }
      console.error('Failed to update vacancy:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteVacancyId(id);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteVacancyId(null);
  };

  const handleDeleteVacancy = async () => {
    if (!deleteVacancyId) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      await axios.delete(`http://localhost:5000/api/vacancies/${deleteVacancyId}`, getAuthHeaders());
      setSuccessMessage('Vacancy deleted successfully!');
      fetchVacancies();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete vacancy. Please try again.';
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. You must be a System Manager to delete vacancies.');
      } else {
        setError(errorMessage);
      }
      console.error('Failed to delete vacancy:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
      closeDeleteConfirm();
    }
  };

  // Update backgroundImage when title changes for new vacancy
  const handleTitleChange = (e) => {
    const selectedTitle = e.target.value;
    const backgroundImage = roleImageMap[selectedTitle] || '';
    if (editingVacancy) {
      setEditingVacancy({ ...editingVacancy, title: selectedTitle, backgroundImage });
      setFormErrors((prev) => ({ ...prev, title: '' }));
    } else {
      setNewVacancy({ ...newVacancy, title: selectedTitle, backgroundImage });
      setFormErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    if (editingVacancy) {
      setEditingVacancy({ ...editingVacancy, description });
      setFormErrors((prev) => ({ ...prev, description: '' }));
    } else {
      setNewVacancy({ ...newVacancy, description });
      setFormErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Confirm Deletion</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this vacancy? This action cannot be undone.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Add Vacancies
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Manage job vacancies for the careers page
          </p>
        </header>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl">
              {successMessage}
            </div>
          )}

          {/* Add/Edit Vacancy Form */}
          <div className="mb-8 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaBriefcase className="mr-2 text-green-500" />
              {editingVacancy ? 'Edit Vacancy' : 'Add New Vacancy'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Job Title *</label>
                <select
                  value={editingVacancy ? editingVacancy.title : newVacancy.title}
                  onChange={handleTitleChange}
                  className={`w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.title ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Job Title</option>
                  {careerOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">Description *</label>
                <input
                  type="text"
                  value={editingVacancy ? editingVacancy.description : newVacancy.description}
                  onChange={handleDescriptionChange}
                  placeholder="Job Description"
                  className={`w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${formErrors.description ? 'border-red-500' : ''}`}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              {editingVacancy ? (
                <>
                  <button
                    onClick={handleEditVacancy}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingVacancy(null);
                      setFormErrors({});
                    }}
                    disabled={isLoading}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddVacancy}
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Vacancy'}
                </button>
              )}
            </div>
          </div>

          {/* Vacancies Table */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Current Vacancies</h3>
            {isLoading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : vacancies.length === 0 ? (
              <div className="text-gray-600 text-center">No vacancies available.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-gray-800 font-semibold">Job Title</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Description</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Background Image</th>
                      <th className="py-3 px-4 text-gray-800 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacancies.map((vacancy) => (
                      <tr
                        key={vacancy._id}
                        className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-200"
                      >
                        <td className="py-3 px-4">{vacancy.title}</td>
                        <td className="py-3 px-4">{vacancy.description}</td>
                        <td className="py-3 px-4">
                          {vacancy.backgroundImage ? (
                            <a href={vacancy.backgroundImage} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                              View Image
                            </a>
                          ) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => setEditingVacancy(vacancy)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(vacancy._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <ConfirmationModal
            onConfirm={handleDeleteVacancy}
            onCancel={closeDeleteConfirm}
          />
        )}
      </div>
    </div>
  );
}