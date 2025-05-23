// frontend\src\dashboards\GrowerHandler\PlantFormPage.js
import React, { useState } from "react";

const PlantFormPage = () => {
  const [formData, setFormData] = useState({
    plantId: "",
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
    plantImage: "",
    description: "",
    plantBatchStatus: "",
    plantAvailability: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("Submitting form:", formData);

    try {
      // Convert string values to numbers for numeric fields
      const convertedFormData = {
        ...formData,
        waterTemperatureMin: parseFloat(formData.waterTemperatureMin),
        waterTemperatureMax: parseFloat(formData.waterTemperatureMax),
        pHMin: parseFloat(formData.pHMin),
        pHMax: parseFloat(formData.pHMax),
      };

      //  validation for max > min ---
      // Check if waterTemperatureMax is greater than waterTemperatureMin
      if (convertedFormData.waterTemperatureMax <= convertedFormData.waterTemperatureMin) {
        setErrorMessage("Water Temperature Max must be greater than Water Temperature Min");
        setIsSuccess(false);
        return; // Stop submission if validation fails
      }

      // Check if pHMax is greater than pHMin
      if (convertedFormData.pHMax <= convertedFormData.pHMin) {
        setErrorMessage("pH Max must be greater than pH Min");
        setIsSuccess(false);
        return; // Stop submission if validation fails
      }
      //  End of validation for max > min ---

      const response = await fetch("http://localhost:5000/api/grower/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedFormData),
      });

      console.log("Response:", response);

      if (response.ok) {
        console.log("Plant data successfully submitted!");
        setIsSuccess(true);
        setFormData({
          plantId: "",
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
          plantImage: "",
          description: "",
          plantBatchStatus: "",
          plantAvailability: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to submit plant data:", errorData.message);
        setErrorMessage(errorData.message || "Failed to submit plant data.");
      }
    } catch (error) {
      console.error("Error submitting plant data:", error);
      setErrorMessage("An unexpected error occurred while submitting the form.");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/AddPlantbackground.mp4" type="video/mp4" />
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center">
        <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-md rounded-lg p-6 mt-4 mb-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold text-center mb-6">Add a New Plant</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
            <input
              type="text"
              name="plantId"
              value={formData.plantId}
              onChange={handleChange}
              required
              placeholder="Plant ID "
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleChange}
              required
              placeholder="Plant Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            <input
              type="text"
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              required
              placeholder="Scientific Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
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
            <input
              type="text"
              name="plantImage"
              value={formData.plantImage}
              onChange={handleChange}
              placeholder="Plant Image URL"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded text-black placeholder-black"
              rows="4"
            />
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
            <button
              type="submit"
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </form>

          {isSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded text-center">
              Plant added successfully!
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-200 text-red-800 rounded text-center">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantFormPage;