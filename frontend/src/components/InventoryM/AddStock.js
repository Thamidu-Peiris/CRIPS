import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AddStock = () => {
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

      await axios.post('http://localhost:5000/api/inventory/plantstock/addPlantStock', payload);
      setMessage('✅ Stock Added Successfully');

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
    <div className="bg-green-50 min-h-screen pl-48">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg mt-10 p-8">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌿 Add Plant Stock 🌿</h2>

        {message && (
          <div className={`mb-4 p-3 rounded text-center font-semibold ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-semibold text-green-800 mb-1">Select Plant:</label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="">-- Select Plant --</option>
            {plants.map((plant) => (
              <option key={plant.plantId} value={plant.plantId}>
                {plant.plantName} ({plant.plantId})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-green-800 mb-1">Quantity (in units):</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter quantity"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-green-800 mb-1">Item Price ($):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter price per item"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-green-800 mb-1">Expiration Date:</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full p-3 border rounded"
          />
        </div>

        <button
          onClick={handleAddStock}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
        >
          ➕ Add Stock
        </button>
      </div>
    </div>
  );
};

export default AddStock;
