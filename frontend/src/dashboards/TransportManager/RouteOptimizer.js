// frontend\src\dashboards\TransportManager\RouteOptimizer.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 text-white font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-72 p-8">
        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-lime-400 bg-clip-text text-transparent mb-4">
            Route Optimizer
          </h2>

          {error && <div className="text-red-400 mb-4">{error}</div>}

          {/* Delivery Points Form */}
          <div className="space-y-4 mb-6">
            {locations.map((loc, index) => (
              <div key={loc.id} className="flex space-x-4">
                <input
                  type="text"
                  value={loc.address}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder={`Delivery Point ${index + 1}`}
                />
                {locations.length > 1 && (
                  <button
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red-400 hover:text-red-500 transition"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddLocation}
              className="text-sm text-cyan-300 hover:text-cyan-400 transition underline"
            >
              + Add Another Location
            </button>
          </div>

          <button
            onClick={handleOptimizeRoute}
            disabled={isLoading}
            className="bg-gradient-to-r from-lime-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-lime-600 hover:to-green-700 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Optimizing...' : 'Optimize Route'}
          </button>

          {/* Optimized Route Output */}
          {optimizedRoute.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-lime-300 mb-2">Optimized Delivery Order:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-200">
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
