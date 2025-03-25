import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom"; // for navigation
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

// Data Source: This file fetches environmental data (temperature, humidity, soil moisture, and cloud cover) from the Open-Meteo Historical Weather API (https://open-meteo.com/). Light levels are estimated based on cloud cover, and plant names/categories are randomly assigned.

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// Static list of plants and categories 
const plantList = [
  { plantName: "Fern", category: "Mosses" },
  { plantName: "Lily", category: "Submerged" },
  { plantName: "Water Hyacinth", category: "Floating" },
  { plantName: "Cattail", category: "Emergent" },
  { plantName: "Iris", category: "Marginal" },
  { plantName: "Duckweed", category: "Floating" },
  { plantName: "Hornwort", category: "Submerged" },
  { plantName: "Arrowhead", category: "Emergent" },
  { plantName: "Water Lily", category: "Marginal" },
];

// Critical thresholds for environmental parameters
const thresholds = {
  temperature: { min: 15, max: 30 },
  humidity: { min: 40, max: 80 },
  lightLevel: { min: 500, max: 1000 },
  soilMoisture: { min: 30, max: 80 },
};

const EnvironmentalMonitoring = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("All Plants");
  const [timeWarning, setTimeWarning] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // data from Open-Meteo API
  useEffect(() => {
    const fetchData = async () => {
      try {
        //  historical weather data for March 15 to March 24, 2025
        // Location: A region where these plants might grow (e.g., Florida, USA: lat 27.6648, lon -81.5158)
        const response = await fetch(
          "https://archive-api.open-meteo.com/v1/archive?latitude=27.6648&longitude=-81.5158&start_date=2025-03-15&end_date=2025-03-24&hourly=temperature_2m,relative_humidity_2m,soil_moisture_0_to_7cm,cloud_cover"
        );
        const result = await response.json();

        // Transform the data
        const transformedData = result.hourly.time.map((time, index) => {
          // Randomly assign a plant and category to each data point
          const randomPlant = plantList[Math.floor(Math.random() * plantList.length)];
          
          // Estimate light level based on cloud cover (0% cloud cover = 1000 lux, 100% = 400 lux)
          const cloudCover = result.hourly.cloud_cover[index];
          const lightLevel = 1000 - (cloudCover * 6); // Linear interpolation

          return {
            plantName: randomPlant.plantName,
            category: randomPlant.category,
            temperature: result.hourly.temperature_2m[index],
            humidity: result.hourly.relative_humidity_2m[index],
            lightLevel: lightLevel,
            soilMoisture: result.hourly.soil_moisture_0_to_7cm[index] * 100, // Convert to percentage
            timestamp: new Date(time).toISOString(),
          };
        });

        // Simulate 50 data points by sampling every 4th hour (240 hours / 4 = 60, we'll take 50)
        const sampledData = transformedData.filter((_, index) => index % 4 === 0).slice(0, 50);

        setData(sampledData);
        setFilteredData(sampledData);

        // Check timestamp distribution
        const timestamps = sampledData.map((d) => new Date(d.timestamp).getTime());
        const timeRange = (Math.max(...timestamps) - Math.min(...timestamps)) / (1000 * 60 * 60 * 24); // Days
        if (timeRange < 1) {
          setTimeWarning("Warning: Data timestamps are too close together (less than 1 day apart). Consider using a dataset with a wider time range.");
        } else {
          setTimeWarning("");
        }
      } catch (error) {
        console.error("Error fetching data from Open-Meteo:", error);
      }
    };

    fetchData();
  }, []);

  // Handle plant filter change
  const handlePlantChange = (e) => {
    const plant = e.target.value;
    setSelectedPlant(plant);
    if (plant === "All Plants") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((d) => d.plantName === plant));
    }
  };

  //  navigation to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboards/GrowerHandler"); // Adjust the route based on your dashboard path
  };

  // Prepare chart data for each parameter
  const prepareChartData = (parameter, label, color, threshold) => {
    const labels = filteredData.map((d) =>
      new Date(d.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
      })
    );

    const values = filteredData.map((d) => d[parameter]);
    const criticalPoints = values.map((value, idx) => {
      if (value < threshold.min || value > threshold.max) {
        return { x: labels[idx], y: value, label: "⚠️" };
      }
      return null;
    }).filter(Boolean);

    // Limit the number of critical points displayed when "All Plants" is selected
    const displayedCriticalPoints =
      selectedPlant === "All Plants" ? criticalPoints.slice(0, 3) : criticalPoints;

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: color,
          backgroundColor: color,
          fill: false,
          tension: 0.1,
        },
      ],
      criticalPoints: displayedCriticalPoints,
    };
  };

  // Chart options with annotations for critical thresholds
  const chartOptions = (parameter, threshold) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: parameter.charAt(0).toUpperCase() + parameter.slice(1) },
      annotation: {
        annotations: {
          minLine: {
            type: "line",
            yMin: threshold.min,
            yMax: threshold.min,
            borderColor: "red",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `Min: ${threshold.min}`,
              enabled: true,
              position: "start",
            },
          },
          maxLine: {
            type: "line",
            yMin: threshold.max,
            yMax: threshold.max,
            borderColor: "red",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: `Max: ${threshold.max}`,
              enabled: true,
              position: "start",
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const isCritical = value < threshold.min || value > threshold.max;
            return `${context.dataset.label}: ${value}${isCritical ? " ⚠️" : ""}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: parameter } },
    },
  });

  // Prepare chart data for each parameter
  const temperatureData = prepareChartData("temperature", "Temperature (°C)", "rgb(255, 99, 132)", thresholds.temperature);
  const humidityData = prepareChartData("humidity", "Humidity (%)", "rgb(54, 162, 235)", thresholds.humidity);
  const lightLevelData = prepareChartData("lightLevel", "Light Level (lux)", "rgb(255, 206, 86)", thresholds.lightLevel);
  const soilMoistureData = prepareChartData("soilMoisture", "Soil Moisture (%)", "rgb(75, 192, 192)", thresholds.soilMoisture);

  return (
    <div>
      {/* Embed CSS directly in the JSX */}
      <style>
        {`
          .environmental-monitoring {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .title {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem; /* Increased font size */
            color: teal; /* Teal color for the title */
            font-weight: bold;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .filter {
            display: flex;
            align-items: center;
          }

          .filter label {
            margin-right: 10px;
            font-weight: bold;
            color: teal; /* Teal color for the label */
          }

          .filter select {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid teal;
            color: teal;
            font-weight: bold;
          }

          .back-button {
            padding: 8px 16px;
            background-color: teal;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s;
          }

          .back-button:hover {
            background-color: #008080; /* Slightly darker teal on hover */
          }

          .charts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
          }

          .chart-container {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .critical-point {
            margin-top: 10px;
            font-size: 14px;
          }
        `}
      </style>

      <div className="environmental-monitoring">
        <h1 className="title">Environmental Monitoring</h1>

        {/* Timestamp Warning */}
        {timeWarning && (
          <div className="time-warning" style={{ backgroundColor: "yellow", padding: "10px", marginBottom: "20px" }}>
            {timeWarning}
          </div>
        )}

        {/* Header with Filter and Back Button */}
        <div className="header">
          <div className="filter">
            <label htmlFor="plant-select">Select Plant: </label>
            <select id="plant-select" value={selectedPlant} onChange={handlePlantChange}>
              <option value="All Plants">All Plants</option>
              {[...new Set(data.map((d) => d.plantName))].map((plant) => (
                <option key={plant} value={plant}>
                  {plant}
                </option>
              ))}
            </select>
          </div>
          <button className="back-button" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart-container">
            <Line
              data={temperatureData}
              options={chartOptions("temperature", thresholds.temperature)}
            />
            {temperatureData.criticalPoints.map((point, idx) => (
              <div key={idx} className="critical-point" style={{ color: "red" }}>
                ⚠️ Critical Temperature at {point.x}: {point.y}°C
              </div>
            ))}
          </div>

          <div className="chart-container">
            <Line
              data={humidityData}
              options={chartOptions("humidity", thresholds.humidity)}
            />
            {humidityData.criticalPoints.map((point, idx) => (
              <div key={idx} className="critical-point" style={{ color: "red" }}>
                ⚠️ Critical Humidity at {point.x}: {point.y}%
              </div>
            ))}
          </div>

          <div className="chart-container">
            <Line
              data={lightLevelData}
              options={chartOptions("lightLevel", thresholds.lightLevel)}
            />
            {lightLevelData.criticalPoints.map((point, idx) => (
              <div key={idx} className="critical-point" style={{ color: "red" }}>
                ⚠️ Critical Light Level at {point.x}: {point.y} lux
              </div>
            ))}
          </div>

          <div className="chart-container">
            <Line
              data={soilMoistureData}
              options={chartOptions("soilMoisture", thresholds.soilMoisture)}
            />
            {soilMoistureData.criticalPoints.map((point, idx) => (
              <div key={idx} className="critical-point" style={{ color: "red" }}>
                ⚠️ Critical Soil Moisture at {point.x}: {point.y}%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalMonitoring;