import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryManagerAddStock = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGrowerPlants();
  }, []);

  const fetchGrowerPlants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/grower/plants');
      console.log("Fetched Plants:", response.data);
      setPlants(response.data);
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

  const handleAddStock = async () => {
    if (!selectedPlant || !quantity || !itemPrice || !expirationDate) {
      setMessage('❌ All fields are required');
      return;
    }

    try {
      const payload = {
        plantId: selectedPlant,
        quantity: parseInt(quantity),
        itemPrice: parseFloat(itemPrice),
        expirationDate,
      };

      const res = await axios.post('http://localhost:5000/api/inventory/plantstock/addPlantStock', payload);
      setMessage('✅ Stock Added Successfully');
      console.log("Added Stock:", res.data);
      // Reset form
      setSelectedPlant('');
      setQuantity('');
      setItemPrice('');
      setExpirationDate('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to Add Stock');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Plant Stock</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Plant:</label>
        <select
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select --</option>
          {plants.map((plant) => (
            <option key={plant.plantId} value={plant.plantId}>
              {plant.plantName} ({plant.plantId})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Available Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
          min="1"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Item Price ($):</label>
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          className="w-full border p-2 rounded"
          step="0.01"
          min="0"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Expiration Date:</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        onClick={handleAddStock}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
      >
        ➕ Add Stock
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default InventoryManagerAddStock;