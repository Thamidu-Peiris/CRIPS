import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboards/SM/sideBar";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaEdit, FaTrash } from "react-icons/fa";

const SMDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("System Manager");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [managerName, setManagerName] = useState("");
  const navigate = useNavigate();

  const categories = [
    "System Manager",
    "Grower Handlers",
    "Cutters",
    "Sales Manager",
    "Inventory Manager",
    "Customer Service Manager",
  ];

  // Add useEffect for initial setup and filtering
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.firstName && user.lastName) {
      setManagerName(`${user.firstName} ${user.lastName}`);
    } else {
      setManagerName("System Manager");
    }
    fetchAllEmployees();
  }, []);
  
  // Filter employees whenever employees or selectedCategory changes
  useEffect(() => {
    filterEmployeesByCategory(selectedCategory);
  }, [employees, selectedCategory]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
  
      const response = await axios.get("http://localhost:5000/api/systemManagers/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.response?.data?.message || "Failed to fetch employees. Please try again.");
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const filterEmployeesByCategory = (category) => {
    console.log("Filtering employees for category:", category);
    console.log("All employees:", employees);
    setSelectedCategory(category);
  
    const filtered = employees.filter((emp) => emp.role === category);
  
    console.log("Computed filtered employees:", filtered);
    setFilteredEmployees(filtered);
  };

  const handleUpdateEmployee = async (id, updatedData) => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const role = encodeURIComponent(selectedEmployee.role);
      const response = await axios.put(
        `http://localhost:5000/api/systemManagers/employees/${role}/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Employee updated successfully!");
      // Update employees state locally
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? response.data.data : emp))
      );
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      setError(error.response?.data?.message || "Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");
      const role = encodeURIComponent(selectedEmployee.role);
      await axios.delete(`http://localhost:5000/api/systemManagers/employees/${role}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Employee deleted successfully!");
      // Update employees state locally
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(error.response?.data?.message || "Failed to delete employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EmployeeModal = ({ employee, onClose, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({ ...employee });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(employee._id, formData);
      setIsEditing(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">
            {isEditing ? "Update Employee" : "Employee Details"}
          </h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Contact No</label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ? new Date(formData.dob).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Name:</strong> {employee.firstName} {employee.lastName}
                </p>
              </div>
              <div className="flex items-center">
                <FaUser className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Role:</strong> {employee.role}
                </p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Email:</strong> {employee.email}
                </p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Contact:</strong> {employee.contactNo || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>Address:</strong> {employee.address || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <FaBirthdayCake className="text-green-500 mr-3 text-xl" />
                <p className="text-lg text-gray-600">
                  <strong>DOB:</strong>{" "}
                  {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <FaEdit className="mr-2" /> Update
                </button>
                <button
                  onClick={() => onDelete(employee._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300 mt-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-teal-50 font-sans">
      <Sidebar />
      <div className="ml-64 flex-1 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-green-900">
                System Manager Dashboard
              </h1>
              <p className="text-xl mt-2 font-light text-gray-100">Welcome, {managerName}!</p>
            </div>
            <button
              onClick={() => navigate("/sm-dashboard")}
              className="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
            <p>{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Employee Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-900 mb-4">Employee Management</h2>
          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterEmployeesByCategory(category)}
                className={`px-4 py-2 rounded-xl transition duration-300 ${
                  selectedCategory === category
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Employee List */}
          {loading ? (
            <p className="text-center text-gray-600">Loading employees...</p>
          ) : filteredEmployees.length === 0 ? (
            <p className="text-center text-gray-600">
              No employees found in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee._id}
                  onClick={() => setSelectedEmployee(employee)}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-gray-600">{employee.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Modal */}
        {selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onUpdate={handleUpdateEmployee}
            onDelete={handleDeleteEmployee}
          />
        )}
      </div>
    </div>
  );
};

export default SMDashboard;