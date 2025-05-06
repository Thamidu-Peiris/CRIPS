import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { FaRoute } from 'react-icons/fa';

export default function RouteOptimizer() {
  const [locations, setLocations] = useState([
    { address: '', id: Date.now() },
  ]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index].address = value;
    setLocations(newLocations);
  };

  const handleAddLocation = () => {
    setLocations([...locations, { address: '', id: Date.now() }]);
  };

  const handleRemoveLocation = (index) => {
    const updated = [...locations];
    updated.splice(index, 1);
    setLocations(updated);
  };

  const handleOptimizeRoute = async () => {
    const addresses = locations.map(loc => loc.address.trim()).filter(Boolean);
    if (addresses.length < 2) {
      setError('Please provide at least 2 delivery locations.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await axios.post('http://localhost:5000/api/transport/optimize-route', {
        locations: addresses,
      });

      setOptimizedRoute(res.data.optimized || []);
    } catch (err) {
      console.error(err);
      setError('Failed to optimize route. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <header className="p-6 bg-white rounded-xl shadow-md border border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-green-900">
            Route Optimizer
          </h1>
          <p className="text-xl mt-2 font-light text-gray-600">
            Optimize delivery routes for efficient transport
          </p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
              <p>{error}</p>
            </div>
          )}

          {/* Delivery Points Form - Redesigned as a Card */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-green-900 mb-4 flex items-center">
              <FaRoute className="mr-2 text-green-500" />
              Enter Delivery Locations
            </h2>
            <div className="space-y-4">
              {locations.map((loc, index) => (
                <div key={loc.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 font-semibold mb-1">Delivery Point {index + 1}</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => handleLocationChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`Enter delivery point ${index + 1}`}
                    />
                  </div>
                  {locations.length > 1 && (
                    <button
                      onClick={() => handleRemoveLocation(index)}
                      className="text-red-600 hover:text-red-700 transition mt-6"
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleAddLocation}
                className="text-sm text-green-600 hover:text-green-700 transition underline"
              >
                + Add Another Location
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleOptimizeRoute}
                disabled={isLoading}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Optimizing...' : 'Optimize Route'}
              </button>
            </div>
          </div>

          {/* Optimized Route Output - Redesigned as a Card */}
          {optimizedRoute.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Optimized Delivery Order</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-800">
                {optimizedRoute.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}