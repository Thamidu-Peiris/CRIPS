import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const GrowerHandlerDashboard = () => {
  const navigate = useNavigate();

  // State for weather data
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock weather data for Colombo
  const currentWeather = {
    city: "Colombo",
    temperature: 29,
    condition: "PartlyCloudy",
    pressure: 1010,
    humidity: 75,
    windSpeed: 15,
    windDirection: "NE",
    rainChance: 20,
    uvIndex: 8,
  };

  const hourlyForecast = [
    { time: "00:00", temperature: 27 },
    { time: "03:00", temperature: 26 },
    { time: "06:00", temperature: 27 },
    { time: "09:00", temperature: 29 },
    { time: "12:00", temperature: 31 },
    { time: "15:00", temperature: 30 },
    { time: "18:00", temperature: 28 },
    { time: "21:00", temperature: 27 },
  ];

  const thisWeekForecast = [
    { date: "Mar 25", temperature: 29, condition: "Cloudy" },
    { date: "Mar 26", temperature: 30, condition: "Sunny" },
    { date: "Mar 27", temperature: 29, condition: "Cloudy" },
    { date: "Mar 28", temperature: 28, condition: "Rainy" },
    { date: "Mar 29", temperature: 29, condition: "Sunny" },
    { date: "Mar 30", temperature: 30, condition: "Sunny" },
    { date: "Mar 31", temperature: 28, condition: "Rainy" },
  ];

  const nextWeekForecast = [
    { date: "Apr 1", temperature: 28, condition: "Rainy" },
    { date: "Apr 2", temperature: 29, condition: "Cloudy" },
    { date: "Apr 3", temperature: 30, condition: "Sunny" },
    { date: "Apr 4", temperature: 29, condition: "Rainy" },
    { date: "Apr 5", temperature: 28, condition: "Rainy" },
    { date: "Apr 6", temperature: 29, condition: "Cloudy" },
    { date: "Apr 7", temperature: 30, condition: "Sunny" },
  ];

  // Fetch weather data (mocked here, but you can replace with a real API call)
  const fetchWeatherData = async () => {
    try {
      
      setWeatherData({
        current: currentWeather,
        hourly: hourlyForecast,
        thisWeek: thisWeekForecast,
        nextWeek: nextWeekForecast,
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching weather data:", err);
    }
  };

  // Fetch data on mount and every 10 seconds for real-time updates
  useEffect(() => {
    // Initial fetch
    fetchWeatherData();

    // Polling every 10 seconds for real-time updates
    const interval = setInterval(fetchWeatherData, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  // Function to get color for weather condition
  const getConditionColor = (condition) => {
    switch (condition) {
      case "Sunny":
        return "text-yellow-500";
      case "Rainy":
        return "text-blue-500";
      case "PartlyCloudy":
        return "text-gray-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <GHSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <GHNavbar />

        {/* Dashboard Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Grower Handler Dashboard
          </h2>
          <p className="text-gray-600">
            Monitor weather conditions and your greenhouse live feed.
          </p>

          {/* Weather and Live Feed */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weather Section (2/3 of the layout) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Weather and Hourly Forecast */}
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-5xl font-bold text-blue-600">{weatherData.current.temperature}°</span>
                      <span className="ml-4 text-xl text-gray-600">{weatherData.current.condition}</span>
                    </div>
                    <p className="text-gray-500">{weatherData.current.city}</p>
                    <p className="text-gray-500">
                      Pressure: {weatherData.current.pressure} hPa | Humidity: {weatherData.current.humidity}%
                    </p>
                  </div>
                  <div className="h-32 w-full max-w-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weatherData.hourly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#FF6384" dot={true} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Weather Details (Wind, Rain Chance, Pressure, UV Index) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Wind Speed */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Wind</h3>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.current.windSpeed} km/h</p>
                  <div className="relative w-16 h-16 mx-auto mt-2">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <line
                        x1="50"
                        y1="50"
                        x2="50"
                        y2="20"
                        stroke="#3b82f6"
                        strokeWidth="5"
                        transform={`rotate(${weatherData.current.windDirection === "NE" ? 45 : 0}, 50, 50)`}
                      />
                      <text x="50" y="15" textAnchor="middle" fill="#3b82f6" fontSize="12">N</text>
                      <text x="85" y="55" textAnchor="middle" fill="#3b82f6" fontSize="12">E</text>
                      <text x="50" y="90" textAnchor="middle" fill="#3b82f6" fontSize="12">S</text>
                      <text x="15" y="55" textAnchor="middle" fill="#3b82f6" fontSize="12">W</text>
                    </svg>
                  </div>
                </div>

                {/* Rain Chance */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Rain Chance</h3>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.current.rainChance}%</p>
                  <p className="text-gray-500 mt-2">Low</p>
                </div>

                {/* Pressure */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Pressure</h3>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.current.pressure} hPa</p>
                  <p className="text-gray-500 mt-2">Normal</p>

                </div>

                {/* UV Index */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">UV Index</h3>
                  <p className="text-2xl font-bold text-blue-600">{weatherData.current.uvIndex}</p>
                  <p className="text-gray-500 mt-2">High</p>
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Current Temperature */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Current Temperature</h3>
                  <p className="text-2xl font-bold text-teal-600">28°C</p>
                </div>

                {/* Current Humidity (mapped to Soil Moisture) */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Current Soil Moisture</h3>
                  <p className="text-2xl font-bold text-teal-600">70%</p>
                </div>

                {/* Current pH */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Current pH Condition</h3>
                  <p className="text-2xl font-bold text-teal-600">6.5</p>
                </div>

                {/* Current Light Conditions */}
                <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                  <h3 className="text-lg font-semibold mb-2">Current Light Conditions</h3>
                  <p className="text-2xl font-bold text-teal-600">1200 lux</p>
                </div>
              </div>

              {/* Live Feed */}
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Live Feed</h3>
                <video
                  autoPlay
                  loop
                  muted
                  className="w-full h-80 object-cover rounded-lg"
                >
                  <source src="/MonitorEnvBG.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="text-gray-500 text-sm mt-2">
                  Real-time monitoring of your greenhouse.
                </p>
              </div>
            </div>

            {/* Weekly Forecast  */}
            <div className="space-y-6">
              {/* This Week Forecast */}
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">This Week</h3>
                <div className="space-y-3">
                  {weatherData.thisWeek.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="text-gray-600">{day.date}</p>
                      <p className="text-gray-600">{day.temperature}°</p>
                      <p className={getConditionColor(day.condition)}>{day.condition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Week Forecast */}
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Next Week</h3>
                <div className="space-y-3">
                  {weatherData.nextWeek.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="text-gray-600">{day.date}</p>
                      <p className="text-gray-600">{day.temperature}°</p>
                      <p className={getConditionColor(day.condition)}>{day.condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default GrowerHandlerDashboard;