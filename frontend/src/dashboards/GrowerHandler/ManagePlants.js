import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManagePlants = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState("");

  // Fetch plants from the database
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/plants");
        if (!response.ok) {
          throw new Error("Failed to fetch plants");
        }
        const data = await response.json();
        setPlants(data);
        setFilteredPlants(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Handle Search and Filter
  const handleSearchAndFilter = (search, category) => {
    let updatedPlants = [...plants];

    // Apply search
    if (search) {
      updatedPlants = updatedPlants.filter((plant) =>
        plant.plantName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply filter by speciesCategory
    if (category) {
      updatedPlants = updatedPlants.filter((plant) => plant.speciesCategory === category);
    }

    setFilteredPlants(updatedPlants);
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    handleSearchAndFilter(search, filterCategory);
  };

  const handleFilter = (e) => {
    const category = e.target.value;
    setFilterCategory(category);
    handleSearchAndFilter(searchTerm, category);
  };

  // Handle Update
  const handleUpdateClick = (plant) => {
    setSelectedPlant({ ...plant }); // Create a copy to avoid mutating the original
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/plants/${selectedPlant._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlant),
      });

      if (!response.ok) {
        throw new Error("Failed to update plant");
      }

      const updatedPlant = await response.json();
      const updatedPlants = plants.map((p) =>
        p._id === selectedPlant._id ? { ...p, ...updatedPlant } : p
      );
      setPlants(updatedPlants);
      handleSearchAndFilter(searchTerm, filterCategory); // Reapply search and filter
      setIsSuccessMessage("Plant updated successfully!");
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Error updating plant:", err);
      setIsSuccessMessage("Failed to update plant. Please try again.");
    }
  };

  // Handle Delete
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete plant");
        }

        const updatedPlants = plants.filter((plant) => plant._id !== id);
        setPlants(updatedPlants);
        handleSearchAndFilter(searchTerm, filterCategory); // Reapply search and filter
        setIsSuccessMessage("Plant deleted successfully!");
      } catch (err) {
        console.error("Error deleting plant:", err);
        setIsSuccessMessage("Failed to delete plant. Please try again.");
      }
    }
  };

  // Handle form input changes in the update modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlant((prev) => ({ ...prev, [name]: value }));
  };

  const fallbackImage = "https://via.placeholder.com/100x100?text=No+Image";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <button
          onClick={() => navigate("/dashboards/GrowerHandler")}
          className="mt-4 inline-block p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Manage Plants</h1>
        <button
          onClick={() => navigate("/dashboards/GrowerHandler")}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label htmlFor="search" className="mr-2 text-gray-700">Search by Name:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            className="p-2 border rounded text-black placeholder-gray-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div>
          <label htmlFor="filter" className="mr-2 text-gray-700">Filter by Category:</label>
          <select
            id="filter"
            className="p-2 border rounded text-black"
            value={filterCategory}
            onChange={handleFilter}
          >
            <option value="">All Categories</option>
            <option value="Floating">Floating</option>
            <option value="Submerged">Submerged</option>
            <option value="Emergent">Emergent</option>
            <option value="Marginal">Marginal</option>
            <option value="Mosses">Mosses</option>
          </select>
        </div>
      </div>

      {/* Success/Error Message */}
      {isSuccessMessage && (
        <div
          className={`p-3 rounded mb-6 ${
            isSuccessMessage.includes("Failed")
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {isSuccessMessage}
        </div>
      )}

      {/* Plants Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Plant Name</th>
              <th className="border p-2 text-left">Scientific Name</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Light Requirement</th>
              <th className="border p-2 text-left">Water Temp (Min-Max)</th>
              <th className="border p-2 text-left">pH (Min-Max)</th>
              <th className="border p-2 text-left">CO2 Requirement</th>
              <th className="border p-2 text-left">Fertilizer Requirement</th>
              <th className="border p-2 text-left">Stock</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Supplier</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Batch Status</th>
              <th className="border p-2 text-left">Availability</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlants.map((plant) => (
              <tr key={plant._id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <img
                    src={plant.plantImage || fallbackImage}
                    alt={plant.plantName}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                </td>
                <td className="border p-2">{plant.plantName}</td>
                <td className="border p-2">{plant.scientificName}</td>
                <td className="border p-2">{plant.speciesCategory}</td>
                <td className="border p-2">{plant.lightRequirement}</td>
                <td className="border p-2">
                  {plant.waterTemperatureMin}°C - {plant.waterTemperatureMax}°C
                </td>
                <td className="border p-2">
                  {plant.pHMin} - {plant.pHMax}
                </td>
                <td className="border p-2">{plant.co2Requirement || "Not specified"}</td>
                <td className="border p-2">{plant.fertilizerRequirement || "Not specified"}</td>
                <td className="border p-2">{plant.stockQuantity}</td>
                <td className="border p-2">${plant.pricePerUnit}</td>
                <td className="border p-2">{plant.supplierName}</td>
                <td className="border p-2">{plant.description || "No description"}</td>
                <td className="border p-2">{plant.plantBatchStatus || "Not specified"}</td>
                <td className="border p-2">{plant.plantAvailability || "Not specified"}</td>
                <td className="border p-2">
                  <select
                    className="p-1 border rounded text-black"
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action === "update") {
                        handleUpdateClick(plant);
                      } else if (action === "delete") {
                        handleDeleteClick(plant._id);
                      }
                      e.target.value = ""; // Reset the dropdown
                    }}
                  >
                    <option value="">Actions</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-h-[80vh] overflow-y-auto w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Update Plant</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-700">Plant Name</label>
                <input
                  type="text"
                  name="plantName"
                  value={selectedPlant.plantName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Scientific Name</label>
                <input
                  type="text"
                  name="scientificName"
                  value={selectedPlant.scientificName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Species Category</label>
                <select
                  name="speciesCategory"
                  value={selectedPlant.speciesCategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Floating">Floating</option>
                  <option value="Submerged">Submerged</option>
                  <option value="Emergent">Emergent</option>
                  <option value="Marginal">Marginal</option>
                  <option value="Mosses">Mosses</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Light Requirement</label>
                <select
                  name="lightRequirement"
                  value={selectedPlant.lightRequirement}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                >
                  <option value="">Select Light Requirement</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Water Temperature Min (°C)</label>
                <input
                  type="number"
                  name="waterTemperatureMin"
                  value={selectedPlant.waterTemperatureMin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Water Temperature Max (°C)</label>
                <input
                  type="number"
                  name="waterTemperatureMax"
                  value={selectedPlant.waterTemperatureMax}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">pH Min</label>
                <input
                  type="number"
                  step="0.1"
                  name="pHMin"
                  value={selectedPlant.pHMin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">pH Max</label>
                <input
                  type="number"
                  step="0.1"
                  name="pHMax"
                  value={selectedPlant.pHMax}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">CO2 Requirement</label>
                <input
                  type="text"
                  name="co2Requirement"
                  value={selectedPlant.co2Requirement || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700">Fertilizer Requirement</label>
                <input
                  type="text"
                  name="fertilizerRequirement"
                  value={selectedPlant.fertilizerRequirement || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={selectedPlant.stockQuantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Price Per Unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerUnit"
                  value={selectedPlant.pricePerUnit}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Supplier Name</label>
                <input
                  type="text"
                  name="supplierName"
                  value={selectedPlant.supplierName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Plant Image URL</label>
                <input
                  type="text"
                  name="plantImage"
                  value={selectedPlant.plantImage || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={selectedPlant.description || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700">Plant Batch Status</label>
                <input
                  type="text"
                  name="plantBatchStatus"
                  value={selectedPlant.plantBatchStatus || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label className="block text-gray-700">Plant Availability</label>
                <select
                  name="plantAvailability"
                  value={selectedPlant.plantAvailability || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="">Select Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Preorder">Preorder</option>
                </select>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

export default ManagePlants;