import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/inventory/plantstock/plant/${id}`);
        console.log("Plant Details:", response.data);
        setPlant(response.data);
      } catch (error) {
        console.error("Failed to fetch plant details:", error);
      }
    };
    fetchPlantDetails();
  }, [id]);

  if (!plant) return <div className="text-center p-10 text-gray-500 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">{plant.plantName || "Unknown Plant"}</h1>
        <img
          src={plant.plantImage || 'http://localhost:5000/uploads/default-plant.jpg'}
          alt={plant.plantName || "Unknown Plant"}
          className="w-full h-80 object-cover rounded-lg mb-6 shadow-md transition-transform duration-300 hover:scale-105"
        />
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            <strong className="font-semibold text-green-600">Category:</strong> {plant.category || "N/A"}
          </p>
          <p className="text-gray-700 text-sm">
            <strong className="font-semibold text-green-600">Description:</strong> {plant.description || "N/A"}
          </p>
          <p className="text-green-700 font-semibold text-sm">
            <strong>Available Quantity:</strong> {plant.quantity} units
          </p>
          <p className="text-green-700 font-semibold text-sm">
            <strong>Item Price:</strong> ${plant.itemPrice.toFixed(2)}
          </p>
          <p className="text-gray-700 text-sm">
            <strong className="font-semibold text-green-600">Expiration Date:</strong> {plant.expirationDate ? new Date(plant.expirationDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;