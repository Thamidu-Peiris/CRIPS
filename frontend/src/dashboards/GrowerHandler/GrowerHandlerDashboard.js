import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GHNavbar from "../../components/GHNavbar";
import GHSidebar from "../../components/GHSidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { FaTemperatureHigh, FaTint, FaCloud, FaEye, FaExclamationTriangle } from "react-icons/fa";

// Debug imports
console.log("GHNavbar:", GHNavbar);
console.log("GHSidebar:", GHSidebar);
console.log("FaTemperatureHigh:", FaTemperatureHigh);
console.log("LineChart:", LineChart);

const GrowerHandlerDashboard = () => {
  const navigate = useNavigate();

  // State for weather data and alerts
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [historicalTemp, setHistoricalTemp] = useState([]); // For temperature trend

  // OpenWeatherMap API configuration
  const API_KEY = "c5ba4047dc440fe79c816317c07035c0";
  const CITY = "Colombo";
  const CURRENT_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
  const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=6.9271&lon=79.8612&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`;
  const HOURLY_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=6.9271&lon=79.8612&exclude=minutely,daily,alerts&appid=${API_KEY}&units=metric`;

  // Thresholds for plant safety
  const THRESHOLDS = {
    temperature: { min: 15, max: 35 }, // °C
    humidity: { min: 40, max: 90 }, // %
    cloudCover: { max: 80 }, // % (too much cloud cover reduces sunlight)
  };

  // Fetch weather data from OpenWeatherMap
  const fetchWeatherData = async () => {
    try {
      // Fetch current weather
      const currentResponse = await axios.get(CURRENT_URL);
      const currentData = currentResponse.data;

      // Fetch daily forecast
      const forecastResponse = await axios.get(FORECAST_URL);
      const dailyData = forecastResponse.data.daily.slice(0, 14);

      // Fetch hourly forecast for trend and current conditions
      const hourlyResponse = await axios.get(HOURLY_URL);
      const hourlyData = hourlyResponse.data.hourly.slice(0, 8).map((h) => ({
        time: new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperature: h.temp,
      }));
      const historicalTempData = hourlyResponse.data.hourly.slice(0, 24).map((h) => ({
        temp: h.temp,
        idx: hourlyResponse.data.hourly.indexOf(h),
      }));

      // Calculate start of current week (Monday) and next week
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
      const startOfNextWeek = new Date(startOfWeek);
      startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

      // Filter daily data into this week and next week
      const thisWeekForecast = dailyData
        .filter((day) => {
          const dayDate = new Date(day.dt * 1000);
          return dayDate >= startOfWeek && dayDate < startOfNextWeek;
        })
        .map((day) => ({
          date: new Date(day.dt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          temperature: day.temp.day,
          condition: day.weather[0].main,
        }));

      const nextWeekForecast = dailyData
        .filter((day) => {
          const dayDate = new Date(day.dt * 1000);
          return dayDate >= startOfNextWeek && dayDate < new Date(startOfNextWeek.getTime() + 7 * 86400000);
        })
        .map((day) => ({
          date: new Date(day.dt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          temperature: day.temp.day,
          condition: day.weather[0].main,
        }));

      // Set weather data
      const newWeatherData = {
        current: {
          city: currentData.name,
          temperature: currentData.main.temp,
          feelsLike: currentData.main.feels_like,
          condition: currentData.weather[0].main,
          pressure: currentData.main.pressure,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          windDirection: currentData.wind.deg > 45 && currentData.wind.deg <= 135 ? "NE" : "N",
          rainChance: currentData.clouds.all || 0,
          uvIndex: 8,
          visibility: currentData.visibility / 1000, // Convert to km
          cloudCover: currentData.clouds.all,
        },
        hourly: hourlyData,
        thisWeek: thisWeekForecast,
        nextWeek: nextWeekForecast,
      };
      setWeatherData(newWeatherData);
      setHistoricalTemp(historicalTempData);

      // Check for alerts
      const newAlerts = [];
      if (newWeatherData.current.temperature > THRESHOLDS.temperature.max) {
        newAlerts.push(`High Temperature Alert: ${newWeatherData.current.temperature}°C is above safe levels for plants!`);
      } else if (newWeatherData.current.temperature < THRESHOLDS.temperature.min) {
        newAlerts.push(`Low Temperature Alert: ${newWeatherData.current.temperature}°C is below safe levels for plants!`);
      }
      if (newWeatherData.current.humidity < THRESHOLDS.humidity.min) {
        newAlerts.push(`Low Humidity Alert: ${newWeatherData.current.humidity}% may cause plant stress!`);
      } else if (newWeatherData.current.humidity > THRESHOLDS.humidity.max) {
        newAlerts.push(`High Humidity Alert: ${newWeatherData.current.humidity}% may promote fungal growth!`);
      }
      if (newWeatherData.current.cloudCover > THRESHOLDS.cloudCover.max) {
        newAlerts.push(`High Cloud Cover Alert: ${newWeatherData.current.cloudCover}% may reduce sunlight for photosynthesis!`);
      }
      setAlerts(newAlerts);

      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data");
      setLoading(false);
      console.error("Error fetching weather data:", err);
    }
  };

  // Fetch data on mount and every 10 minutes for real-time updates
  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000); // 10 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Function to get color for weather condition
  const getConditionColor = (condition) => {
    switch (condition) {
      case "Clear":
      case "Sunny":
        return "text-yellow-500";
      case "Rain":
      case "Drizzle":
        return "text-blue-500";
      case "Clouds":
      case "PartlyCloudy":
        return "text-gray-500";
      default:
        return "text-gray-600";
    }
  };

  // Function to get status color for environmental metrics
  const getMetricStatusColor = (metric, value) => {
    if (metric === "temperature") {
      if (value > THRESHOLDS.temperature.max || value < THRESHOLDS.temperature.min) return "text-red-600";
      return "text-teal-600";
    }
    if (metric === "humidity") {
      if (value > THRESHOLDS.humidity.max || value < THRESHOLDS.humidity.min) return "text-red-600";
      return "text-teal-600";
    }
    if (metric === "cloudCover") {
      if (value > THRESHOLDS.cloudCover.max) return "text-red-600";
      return "text-teal-600";
    }
    return "text-teal-600"; // Default for visibility, pH, light
  };

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
                      <span className="text-5xl font-bold text-blue-600">{weatherData.current.temperature}°C</span>
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
              <div className="space-y-4">
                {/* Alerts */}
                {alerts.length > 0 && (
                  <div className="bg-red-100 p-4 rounded-2xl shadow-md flex items-center justify-between">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-600 mr-2" />
                      <p className="text-red-600">{alerts[0]}</p>
                    </div>
                    <button
                      onClick={() => setAlerts([])}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Current Temperature */}
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                      <FaTemperatureHigh className="mr-2" /> Current Temperature
                    </h3>
                    <p className={`text-2xl font-bold ${getMetricStatusColor("temperature", weatherData.current.temperature)}`}>
                      {weatherData.current.temperature}°C
                    </p>
                    <p className="text-gray-500 mt-2">Feels Like: {weatherData.current.feelsLike}°C</p>
                    <div className="mt-2 h-6 w-full">
                      <ResponsiveContainer width="100%" height={24}>
                        <LineChart data={historicalTemp}>
                          <Line type="monotone" dataKey="temp" stroke="#FF6384" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Current Humidity */}
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                      <FaTint className="mr-2" /> Current Humidity
                    </h3>
                    <p className={`text-2xl font-bold ${getMetricStatusColor("humidity", weatherData.current.humidity)}`}>
                      {weatherData.current.humidity}%
                    </p>
                    <p className="text-gray-500 mt-2">Optimal for plants: 40-90%</p>
                  </div>

                  {/* Cloud Cover */}
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                      <FaCloud className="mr-2" /> Cloud Cover
                    </h3>
                    <p className={`text-2xl font-bold ${getMetricStatusColor("cloudCover", weatherData.current.cloudCover)}`}>
                      {weatherData.current.cloudCover}%
                    </p>
                    <p className="text-gray-500 mt-2">Affects sunlight availability</p>
                  </div>

                  {/* Visibility */}
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                      <FaEye className="mr-2" /> Visibility
                    </h3>
                    <p className="text-2xl font-bold text-teal-600">{weatherData.current.visibility} km</p>
                    <p className="text-gray-500 mt-2">Affects air clarity</p>
                  </div>
                </div>

                {/* Placeholder for pH and Light */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2">Current pH Condition</h3>
                    <p className="text-2xl font-bold text-teal-600">6.5</p>
                    <p className="text-gray-500 mt-2 italic">Placeholder: Integrate a sensor API for live data</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                    <h3 className="text-lg font-semibold mb-2">Current Light Conditions</h3>
                    <p className="text-2xl font-bold text-teal-600">1200 lux</p>
                    <p className="text-gray-500 mt-2 italic">Placeholder: Integrate a sensor API for live data</p>
                  </div>
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

            {/* Weekly Forecast */}
            <div className="space-y-6">
              {/* This Week Forecast */}
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">This Week</h3>
                <div className="space-y-3">
                  {weatherData.thisWeek.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="text-gray-600">{day.date}</p>
                      <p className="text-gray-600">{day.temperature}°C</p>
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
                      <p className="text-gray-600">{day.temperature}°C</p>
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