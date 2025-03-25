import React, { useState } from "react";

const AddEnvironmentalData = () => {
  // State for form data
  const [formData, setFormData] = useState({
    plantName: "",
    category: "",
    temperature: "",
    humidity: "",
    lightLevel: "",
    soilMoisture: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // List of plant categories
  const categories = [
    "Floating",
    "Submerged",
    "Emergent",
    "Marginal",
    "Mosses",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/grower/environmental-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(), // Add current timestamp
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setError(null);
        // Reset form after successful submission
        setFormData({
          plantName: "",
          category: "",
          temperature: "",
          humidity: "",
          lightLevel: "",
          soilMoisture: "",
        });
      } else {
        const contentType = response.headers.get("content-type");
        let errorData;

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          setError(errorData.message || "Failed to add environmental data");
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          setError("Unexpected response from server");
        }
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error adding environmental data:", error);
      setError("Error adding environmental data: " + error.message);
      setIsSuccess(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/AddEnvBackground.mp4" type="video/mp4" />
      </video>

      {/* Scrollable Form Container */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center">
        <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-md rounded-lg p-6 mt-4 mb-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold text-center mb-6">Add Environmental Data</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plant Name */}
            <div>
              <label className="block text-black mb-1">Plant Name</label>
              <input
                type="text"
                name="plantName"
                value={formData.plantName}
                onChange={handleChange}
                required
                placeholder="e.g., Fern"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-black mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select Species Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-black mb-1">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
                min="-10"
                max="50"
                step="0.1"
                placeholder="e.g., 25.5"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-black mb-1">Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 60"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Light Level */}
            <div>
              <label className="block text-black mb-1">Light Level (lux)</label>
              <input
                type="number"
                name="lightLevel"
                value={formData.lightLevel}
                onChange={handleChange}
                required
                min="0"
                max="10000"
                step="1"
                placeholder="e.g., 500"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Soil Moisture */}
            <div>
              <label className="block text-black mb-1">Soil Moisture (%)</label>
              <input
                type="number"
                name="soilMoisture"
                value={formData.soilMoisture}
                onChange={handleChange}
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g., 70"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-purple-600"
            >
              Add Data
            </button>
          </form>

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded text-center">
              Environmental data added successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-200 text-red-800 rounded text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEnvironmentalData;