import React, { useState } from "react";

const PlantFormPage = () => {
  const [formData, setFormData] = useState({
    plantName: "",
    scientificName: "",
    speciesCategory: "",
    lightRequirement: "",
    waterTemperatureMin: "",
    waterTemperatureMax: "",
    pHMin: "",
    pHMax: "",
    co2Requirement: "",
    fertilizerRequirement: "",
    stockQuantity: "",
    pricePerUnit: "",
    supplierName: "",
    plantImage: "",
    description: "",
    plantBatchStatus: "",
    plantAvailability: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData); // Debugging Step 1

    try {
      const response = await fetch("http://localhost:5000/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response:", response); // Debugging Step 2

      if (response.ok) {
        console.log("Plant data successfully submitted!");
        setIsSuccess(true);

        setFormData({
          plantName: "",
          scientificName: "",
          speciesCategory: "",
          lightRequirement: "",
          waterTemperatureMin: "",
          waterTemperatureMax: "",
          pHMin: "",
          pHMax: "",
          co2Requirement: "",
          fertilizerRequirement: "",
          stockQuantity: "",
          pricePerUnit: "",
          supplierName: "",
          plantImage: "",
          description: "",
          plantBatchStatus: "",
          plantAvailability: "",
        });
      } else {
        console.error("Failed to submit plant data");
      }
    } catch (error) {
      console.error("Error submitting plant data:", error);
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
        <source src="/AddPlantbackground.mp4" type="video/mp4" />
      </video>

      {/* Scrollable Form Container */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center">
        <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-md rounded-lg p-6 mt-4 mb-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold text-center mb-6">Add a New Plant</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
            {/* Plant Name */}
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              required
              placeholder="Plant Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Scientific Name */}
            <input
              type="text"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              required
              placeholder="Scientific Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Species Category */}
            <select
              name="speciesCategory"
              value={formData.speciesCategory}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Species Category</option>
              <option value="Floating">Floating</option>
              <option value="Submerged">Submerged</option>
              <option value="Emergent">Emergent</option>
              <option value="Marginal">Marginal</option>
              <option value="Mosses">Mosses</option>
            </select>

            {/* Light Requirement */}
            <select
              name="lightRequirement"
              value={formData.lightRequirement}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Light Requirement</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Water Temperature */}
            <input
              type="number"
              name="waterTemperatureMin"
              value={formData.waterTemperatureMin}
              onChange={handleChange}
              required
              placeholder="Water Temperature Min (°C)"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            <input
              type="number"
              name="waterTemperatureMax"
              value={formData.waterTemperatureMax}
              onChange={handleChange}
              required
              placeholder="Water Temperature Max (°C)"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* pH Range */}
            <input
              type="number"
              name="pHMin"
              value={formData.pHMin}
              onChange={handleChange}
              required
              placeholder="pH Min"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            <input
              type="number"
              name="pHMax"
              value={formData.pHMax}
              onChange={handleChange}
              required
              placeholder="pH Max"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* CO2 Requirement */}
            <select
              name="co2Requirement"
              value={formData.co2Requirement}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select CO2 Requirement</option>
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>

            {/* Fertilizer Requirement */}
            <select
              name="fertilizerRequirement"
              value={formData.fertilizerRequirement}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Fertilizer Requirement</option>
              <option value="None">None</option>
              <option value="Weekly">Weekly</option>
              <option value="Biweekly">Biweekly</option>
              <option value="Monthly">Monthly</option>
            </select>

            {/* Stock Quantity */}
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              placeholder="Stock Quantity"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Price Per Unit */}
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={handleChange}
              required
              placeholder="Price Per Unit"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Supplier Name */}
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              required
              placeholder="Supplier Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Plant Image URL */}
            <input
              type="text"
              name="plantImage"
              value={formData.plantImage}
              onChange={handleChange}
              placeholder="Plant Image URL"
              className="w-full p-2 border rounded text-black placeholder-black"
            />

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded text-black placeholder-black"
              rows="4"
            />

            {/* Plant Batch Status */}
            <select
              name="plantBatchStatus"
              value={formData.plantBatchStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Plant Batch Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Discontinued">Discontinued</option>
            </select>

            {/* Plant Availability */}
            <select
              name="plantAvailability"
              value={formData.plantAvailability}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Select Plant Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Preorder">Preorder</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </form>

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded text-center">
              Plant added successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantFormPage;
