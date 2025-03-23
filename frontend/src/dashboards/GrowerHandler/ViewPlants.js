import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewPlants = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 6;

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grower/plants");
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

  // Handle search and filter
  const handleSearchAndFilter = (query, filter) => {
    let updatedPlants = [...plants];

    // Apply search
    if (query) {
      updatedPlants = updatedPlants.filter((plant) =>
        plant.plantName.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filter
    if (filter === "A-Z") {
      updatedPlants.sort((a, b) => a.plantName.localeCompare(b.plantName));
    } else if (filter === "In Stock" || filter === "Out of Stock" || filter === "Preorder") {
      updatedPlants = updatedPlants.filter((plant) => plant.plantAvailability === filter);
    }

    setFilteredPlants(updatedPlants);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    handleSearchAndFilter(query, filterOption);
  };

  // Handle filter
  const handleFilter = (e) => {
    const filter = e.target.value;
    setFilterOption(filter);
    setCurrentPage(1);
    handleSearchAndFilter(searchQuery, filter);
  };

  // Pagination logic
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = filteredPlants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const fallbackImage = "https://via.placeholder.com/200x200?text=No+Image";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
        <button
          onClick={() => navigate("/dashboards/GrowerHandler")}
          className="mt-4 inline-block p-2 bg-orange-500 text-white rounded hover:bg-orange-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">View All Plants</h1>
        <button
          onClick={() => navigate("/dashboards/GrowerHandler")}
          className="p-2 bg-orange-500 text-white rounded hover:bg-orange-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div>
          <label htmlFor="search" className="mr-2 text-gray-700">Search by Name:</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Enter plant name..."
            className="p-2 border rounded text-black placeholder-gray-500"
          />
        </div>
        <div>
          <label htmlFor="filter" className="mr-2 text-gray-700">Filter:</label>
          <select
            id="filter"
            value={filterOption}
            onChange={handleFilter}
            className="p-2 border rounded text-black"
          >
            <option value="">All</option>
            <option value="A-Z">A-Z</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Preorder">Preorder</option>
          </select>
        </div>
      </div>

      {filteredPlants.length === 0 ? (
        <p className="text-center text-gray-500">No plants found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPlants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={plant.plantImage || fallbackImage}
                  alt={plant.plantName}
                  className="w-full h-64 object-cover rounded-t-lg"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{plant.plantName}</h2>
                  <p className="text-gray-600 mt-2"><strong>Description:</strong> {plant.description || "No description available."}</p>
                  <p className="text-gray-600 mt-1"><strong>Availability:</strong> {plant.plantAvailability || "Not specified"}</p>
                  <p className="text-gray-600 mt-1">
                    <strong>Stock Quantity:</strong> {plant.stockQuantity}
                    {plant.stockQuantity < 10 && (
                      <span className="ml-2 text-red-500 font-semibold">(Low Stock!)</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 mx-1 bg-orange-500 text-white rounded hover:bg-orange-700 disabled:bg-gray-300"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`p-2 mx-1 rounded ${
                  currentPage === page
                    ? "bg-orange-700 text-white"
                    : "bg-orange-500 text-white hover:bg-orange-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 mx-1 bg-orange-500 text-white rounded hover:bg-orange-700 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPlants;