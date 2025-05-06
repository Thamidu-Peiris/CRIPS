import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { 
  FaTruck, FaGasPump, FaClipboardCheck, FaBell, FaCheckCircle, FaHourglassHalf, 
  FaCar, FaMapMarkedAlt, FaChartBar, FaTools, FaUser, FaTachometerAlt, FaChartLine,
  FaTemperatureHigh, FaMoneyBillWave, FaStar, FaRoute, FaCloudSun, FaFileAlt, FaCommentDots,
  FaUsers, FaMapMarkerAlt, FaFilter, FaSort, FaPlayCircle, FaImage, FaCloudRain, FaSun, FaCloud
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// Simulated Map Component (Replace with a real map library like Leaflet or Google Maps in production)
const MapComponent = ({ routes }) => {
  return (
    <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <FaMapMarkerAlt className="text-4xl text-green-600 mx-auto mb-2" />
          <p className="text-gray-700">Simulated Route Paths</p>
          <ul className="mt-2 space-y-1">
            {routes.map((route, index) => (
              <li key={index} className="text-sm text-gray-600">
                {route.shipmentId}: Start (6.9271, 79.8612) → End (6.9214, 79.8567)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Photo Gallery Component for Shipments
const PhotoGallery = ({ shipments }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = [
    'https://images.unsplash.com/photo-1580137199140-2f5f4f?ixlib=rb-4.0.3&w=600',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600',
  ];

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="relative">
      <img
        src={photos[currentIndex]}
        alt={`Shipment ${shipments[currentIndex]?.shipmentId || 'Photo'}`}
        className="w-full h-48 object-cover rounded-lg"
        onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')}
      />
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
        <button onClick={prevPhoto} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
          ←
        </button>
        <button onClick={nextPhoto} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
          →
        </button>
      </div>
      <p className="text-center text-gray-600 mt-2">
        Shipment: {shipments[currentIndex]?.shipmentId || 'N/A'}
      </p>
    </div>
  );
};

// Video Player Component
const VideoPlayer = () => {
  return (
    <div className="relative">
      <video
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Placeholder video (replace with a real video URL)
        controls
        className="w-full h-48 rounded-lg shadow-md"
      />
      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg flex items-center">
        <FaPlayCircle className="mr-1" /> Tutorial: Optimize Routes
      </div>
    </div>
  );
};

export default function TransportManagerDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0,
    fuelEfficiency: 0,
    onTimeDelivery: 0,
    activeVehicles: 0,
    maintenanceDue: 0,
    activeDrivers: 0,
    totalCost: 0,
    customerSatisfaction: 0,
  });
  const [recentShipments, setRecentShipments] = useState([]);
  const [recentFuelLogs, setRecentFuelLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertFilter, setAlertFilter] = useState('all');
  const [alertSort, setAlertSort] = useState('desc');
  const [fuelEfficiencyData, setFuelEfficiencyData] = useState([]);
  const [environmentalData, setEnvironmentalData] = useState([]);
  const [costBreakdown, setCostBreakdown] = useState([]);
  const [deliveryPerformance, setDeliveryPerformance] = useState([]);
  const [routeHistory, setRouteHistory] = useState([]);
  const [customerFeedback, setCustomerFeedback] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatInputRef = useRef(null);
  const navigate = useNavigate();

  // Simulated data for charts and widgets (replace with real API data in production)
  useEffect(() => {
    fetchDashboardStats();
    fetchRecentShipments();
    fetchRecentFuelLogs();
    fetchVehicles();
    fetchDrivers();
    fetchSystemAlerts();
    fetchFuelEfficiencyData();
    fetchEnvironmentalData();
    fetchCostBreakdown();
    fetchDeliveryPerformance();
    fetchRouteHistory();
    fetchCustomerFeedback();
    fetchWeatherData();
    fetchComplianceData();
    fetchMessages();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch transport stats:', error);
      setStats({
        activeShipments: 0,
        fuelEfficiency: 0,
        onTimeDelivery: 0,
        activeVehicles: 0,
        maintenanceDue: 0,
        activeDrivers: 0,
        totalCost: 0,
        customerSatisfaction: 0,
      });
    }
  };

  const fetchRecentShipments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shipments/recent');
      setRecentShipments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch recent shipments:', error);
      setRecentShipments([]);
    }
  };

  const fetchRecentFuelLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fuel');
      setRecentFuelLogs(response.data.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to fetch recent fuel logs:', error);
      setRecentFuelLogs([]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setVehicles([]);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drivers'); // Assuming an endpoint exists
      setDrivers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
      setDrivers([
        { _id: '1', name: 'John Doe', status: 'Available', photo: 'https://via.placeholder.com/50?text=John' },
        { _id: '2', name: 'Jane Smith', status: 'On Duty', photo: 'https://via.placeholder.com/50?text=Jane' },
      ]);
    }
  };

  const fetchSystemAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transport/alerts');
      const fetchedAlerts = response.data || [];
      setAlerts(fetchedAlerts);
      setFilteredAlerts(fetchedAlerts);
    } catch (error) {
      console.error('Failed to fetch system alerts:', error);
      setAlerts([]);
      setFilteredAlerts([]);
    }
  };

  const fetchFuelEfficiencyData = async () => {
    try {
      // Simulated data for the chart
      setFuelEfficiencyData([18.5, 19.2, 17.8, 20.1, 19.5, 18.9, 21.0]);
    } catch (error) {
      console.error('Failed to fetch fuel efficiency data:', error);
      setFuelEfficiencyData([0, 0, 0, 0, 0, 0, 0]);
    }
  };

  const fetchEnvironmentalData = async () => {
    try {
      // Simulated data for temperature and humidity
      setEnvironmentalData({
        temperature: [22, 23, 21, 24, 22, 23, 25],
        humidity: [65, 68, 70, 67, 66, 69, 64],
      });
    } catch (error) {
      console.error('Failed to fetch environmental data:', error);
      setEnvironmentalData({ temperature: [], humidity: [] });
    }
  };

  const fetchCostBreakdown = async () => {
    try {
      // Simulated data for cost breakdown
      setCostBreakdown({
        fuel: 5000,
        maintenance: 2000,
        driver: 3000,
      });
    } catch (error) {
      console.error('Failed to fetch cost breakdown:', error);
      setCostBreakdown({ fuel: 0, maintenance: 0, driver: 0 });
    }
  };

  const fetchDeliveryPerformance = async () => {
    try {
      // Simulated data for delivery performance
      setDeliveryPerformance({
        onTime: 75,
        delayed: 25,
      });
    } catch (error) {
      console.error('Failed to fetch delivery performance:', error);
      setDeliveryPerformance({ onTime: 0, delayed: 0 });
    }
  };

  const fetchRouteHistory = async () => {
    try {
      // Simulated data for route history
      setRouteHistory(recentShipments);
    } catch (error) {
      console.error('Failed to fetch route history:', error);
      setRouteHistory([]);
    }
  };

  const fetchCustomerFeedback = async () => {
    try {
      // Simulated data for customer feedback
      setCustomerFeedback([
        { id: 1, shipmentId: 'SHP001', rating: 4.5, comment: 'Great delivery!', photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
        { id: 2, shipmentId: 'SHP002', rating: 3.8, comment: 'Slightly delayed.', photo: 'https://images.unsplash.com/photo-1519125323398-675f1f8d0d07?w=600' },
      ]);
    } catch (error) {
      console.error('Failed to fetch customer feedback:', error);
      setCustomerFeedback([]);
    }
  };

  const fetchWeatherData = async () => {
    try {
      // Simulated weather data
      setWeatherData([
        { day: 'Mon', temp: 28, condition: 'Sunny', icon: <FaSun /> },
        { day: 'Tue', temp: 26, condition: 'Cloudy', icon: <FaCloud /> },
        { day: 'Wed', temp: 24, condition: 'Rainy', icon: <FaCloudRain /> },
      ]);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      setWeatherData([]);
    }
  };

  const fetchComplianceData = async () => {
    try {
      // Simulated compliance data
      setComplianceData([
        { vehicleId: 'V001', document: 'Registration', status: 'Valid', expires: '2025-12-01' },
        { vehicleId: 'V002', document: 'Insurance', status: 'Expired', expires: '2025-04-01' },
      ]);
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
      setComplianceData([]);
    }
  };

  const fetchMessages = async () => {
    try {
      // Simulated messages
      setMessages([
        { id: 1, sender: 'Driver John', message: 'Shipment SHP001 is on track.', timestamp: '2025-05-06T10:00:00Z' },
        { id: 2, sender: 'Driver Jane', message: 'Encountered traffic on Route 1.', timestamp: '2025-05-06T10:05:00Z' },
      ]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  const handleAlertFilter = (type) => {
    setAlertFilter(type);
    if (type === 'all') {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(alerts.filter((alert) => alert.type === type));
    }
  };

  const handleAlertSort = () => {
    const newSort = alertSort === 'desc' ? 'asc' : 'desc';
    setAlertSort(newSort);
    setFilteredAlerts([...filteredAlerts].sort((a, b) => {
      const dateA = new Date(a.timestamp || Date.now());
      const dateB = new Date(b.timestamp || Date.now());
      return newSort === 'desc' ? dateB - dateA : dateA - dateB;
    }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'Transport Manager',
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      chatInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Chart Data Configurations
  const fuelChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Fuel Efficiency (mpg)',
        data: fuelEfficiencyData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const fuelChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Fuel Efficiency Trends (Weekly)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'mpg' } },
      x: { title: { display: true, text: 'Day' } },
    },
  };

  const deliveryChartData = {
    labels: ['On-Time', 'Delayed'],
    datasets: [
      {
        label: 'Delivery Performance',
        data: [deliveryPerformance.onTime, deliveryPerformance.delayed],
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(255, 99, 132)'],
        borderWidth: 1,
      },
    ],
  };

  const deliveryChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Delivery Performance' },
    },
  };

  const environmentalChartData = {
    labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: environmentalData.temperature,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: environmentalData.humidity,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const environmentalChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Environmental Conditions (Last Shipment)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Value' } },
      x: { title: { display: true, text: 'Time' } },
    },
  };

  const costChartData = {
    labels: ['Fuel', 'Maintenance', 'Driver'],
    datasets: [
      {
        label: 'Cost Breakdown ($)',
        data: [costBreakdown.fuel, costBreakdown.maintenance, costBreakdown.driver],
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(54, 162, 235, 0.7)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(255, 206, 86)', 'rgb(54, 162, 235)'],
        borderWidth: 1,
      },
    ],
  };

  const costChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Cost Breakdown (Monthly)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Cost ($)' } },
    },
  };

  const feedbackChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Customer Satisfaction (Rating)',
        data: customerFeedback.map(f => f.rating).concat([4.0, 4.2, 4.5, 4.3]),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const feedbackChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Customer Satisfaction Trends' },
    },
    scales: {
      y: { beginAtZero: true, max: 5, title: { display: true, text: 'Rating (0-5)' } },
      x: { title: { display: true, text: 'Week' } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 text-gray-800 font-sans flex">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        {/* White Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <h1 className="text-4xl font-extrabold text-green-900">Transport Manager Dashboard</h1>
          <p className="text-xl mt-2 font-light text-gray-600">Welcome, Transport Manager!</p>
        </motion.header>

        {/* Key Metrics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {/* Active Shipments */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaTruck className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Shipments</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeShipments}</p>
            <p className="text-sm text-gray-600 mt-1">In transit right now</p>
          </motion.div>

          {/* Fuel Efficiency */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaGasPump className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Fuel Efficiency</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">
              {stats.fuelEfficiency > 0 ? (
                <>
                  {stats.fuelEfficiency} <span className="text-sm">mpg</span>
                </>
              ) : (
                'N/A'
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Fleet average this week</p>
          </motion.div>

          {/* On-Time Delivery */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">On-Time Delivery</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.onTimeDelivery}%</p>
            <p className="text-sm text-gray-600 mt-1">This month’s performance</p>
          </motion.div>

          {/* Active Vehicles */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaCar className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Vehicles</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeVehicles}</p>
            <p className="text-sm text-gray-600 mt-1">Currently operational</p>
          </motion.div>

          {/* Active Drivers */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="flex items-center space-x-3">
              <FaUsers className="text-3xl text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Active Drivers</h3>
            </div>
            <p className="text-3xl font-bold mt-2 text-gray-800">{stats.activeDrivers}</p>
            <p className="text-sm text-gray-600 mt-1">On duty now</p>
          </motion.div>
        </motion.div>

        {/* Expanded Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50"
        >
          <h2 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/shipment-scheduler")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaTruck className="mr-2" /> Schedule Shipment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/fuel-tracker")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaGasPump className="mr-2" /> Log Fuel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/quality-check-log")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaClipboardCheck className="mr-2" /> Quality Check
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/vehicles")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaCar className="mr-2" /> Manage Vehicles
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/route-optimizer")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaMapMarkedAlt className="mr-2" /> Optimize Route
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/transport-reports")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaChartBar className="mr-2" /> View Reports
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/shipment-status")}
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaTachometerAlt className="mr-2" /> Shipment Status
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleQuickAction("/driver-management")} // Assuming a driver management page
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition duration-300 shadow-sm"
            >
              <FaUsers className="mr-2" /> Manage Drivers
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-900 flex items-center">
                <FaBell className="mr-2 text-green-600" /> System Alerts
              </h2>
              <div className="flex space-x-2">
                <select
                  value={alertFilter}
                  onChange={(e) => handleAlertFilter(e.target.value)}
                  className="p-1 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All</option>
                  <option value="warning">Warnings</option>
                  <option value="error">Errors</option>
                </select>
                <button
                  onClick={handleAlertSort}
                  className="flex items-center px-2 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <FaSort className="mr-1" /> Sort {alertSort === 'desc' ? '↓' : '↑'}
                </button>
              </div>
            </div>
            {filteredAlerts.length === 0 ? (
              <p className="text-gray-600">No alerts at this time.</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <motion.li
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-gray-600 flex items-center p-3 rounded-lg ${
                      alert.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}
                  >
                    <FaBell className="mr-2" />
                    {alert.message}
                    <span className="ml-auto text-sm text-gray-500">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Shipments with Photo Gallery */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaTruck className="mr-2 text-green-600" /> Recent Shipments
            </h2>
            <PhotoGallery shipments={recentShipments} />
            {recentShipments.length === 0 ? (
              <p className="text-gray-600 mt-4">No recent shipments available.</p>
            ) : (
              <ul className="space-y-4 mt-4 max-h-40 overflow-y-auto">
                {recentShipments.map((shipment) => (
                  <motion.li
                    key={shipment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{shipment.shipmentId}</span>
                      <p className="text-sm text-gray-500">
                        Departure: {new Date(shipment.departureDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full flex items-center ${
                        shipment.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : shipment.status === "In Transit"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {shipment.status === "Delivered" && <FaCheckCircle className="mr-1" />}
                      {shipment.status === "In Transit" && <FaHourglassHalf className="mr-1" />}
                      {shipment.status === "Pending" && <FaHourglassHalf className="mr-1" />}
                      {shipment.status}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Fuel Efficiency Trends */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-green-600" /> Fuel Efficiency Trends
            </h2>
            <Line data={fuelChartData} options={fuelChartOptions} />
          </div>

          {/* Delivery Performance */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaTachometerAlt className="mr-2 text-green-600" /> Delivery Performance
            </h2>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Pie data={deliveryChartData} options={deliveryChartOptions} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* More Visual Widgets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Vehicle Status */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaCar className="mr-2 text-green-600" /> Vehicle Status
            </h2>
            {vehicles.length === 0 ? (
              <p className="text-gray-600">No vehicles available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <motion.li
                    key={vehicle._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:5000${vehicle.picture}`}
                        alt={vehicle.vehicleId}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=Image+Not+Found')}
                      />
                      <div>
                        <span className="font-medium text-gray-800">{vehicle.vehicleId}</span>
                        <p className="text-sm text-gray-500">{vehicle.type}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        vehicle.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : vehicle.status === "Under Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Driver Management */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaUsers className="mr-2 text-green-600" /> Driver Management
            </h2>
            {drivers.length === 0 ? (
              <p className="text-gray-600">No drivers available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {drivers.map((driver) => (
                  <motion.li
                    key={driver._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={driver.photo}
                        alt={driver.name}
                        className="w-12 h-12 object-cover rounded-full"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=Driver')}
                      />
                      <div>
                        <span className="font-medium text-gray-800">{driver.name}</span>
                        <p className="text-sm text-gray-500">{driver.status}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAction(`/driver-profile/${driver._id}`)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      View Profile
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Fuel Logs */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaGasPump className="mr-2 text-green-600" /> Recent Fuel Logs
            </h2>
            {recentFuelLogs.length === 0 ? (
              <p className="text-gray-600">No recent fuel logs available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {recentFuelLogs.map((log) => (
                  <motion.li
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 py-2 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{log.vehicleId}</span>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{log.liters} liters</p>
                      <p className="text-sm text-gray-600">${log.cost}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Environmental Monitoring and Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Environmental Monitoring */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaTemperatureHigh className="mr-2 text-green-600" /> Environmental Monitoring
            </h2>
            <Line data={environmentalChartData} options={environmentalChartOptions} />
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-600" /> Cost Breakdown
            </h2>
            <Bar data={costChartData} options={costChartOptions} />
          </div>
        </motion.div>

        {/* Route History and Customer Feedback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Route History Map */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaRoute className="mr-2 text-green-600" /> Route History
            </h2>
            <MapComponent routes={routeHistory} />
          </div>

          {/* Customer Feedback */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaStar className="mr-2 text-green-600" /> Customer Feedback
            </h2>
            {customerFeedback.length === 0 ? (
              <p className="text-gray-600">No feedback available.</p>
            ) : (
              <div className="space-y-4">
                <Line data={feedbackChartData} options={feedbackChartOptions} />
                <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {customerFeedback.map((feedback) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 rounded-lg bg-gray-50 flex flex-col items-center"
                    >
                      <img
                        src={feedback.photo}
                        alt={`Feedback for ${feedback.shipmentId}`}
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Feedback')}
                      />
                      <p className="text-gray-800 font-medium">{feedback.shipmentId}</p>
                      <p className="text-yellow-500 flex items-center">
                        {feedback.rating} <FaStar className="ml-1" />
                      </p>
                      <p className="text-sm text-gray-600 text-center">{feedback.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weather Forecast and Compliance Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Weather Forecast */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaCloudSun className="mr-2 text-green-600" /> Weather Forecast
            </h2>
            {weatherData.length === 0 ? (
              <p className="text-gray-600">No weather data available.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {weatherData.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="p-3 rounded-lg bg-gray-50 text-center"
                  >
                    <p className="text-gray-800 font-medium">{day.day}</p>
                    <div className="text-3xl text-green-600 my-2">{day.icon}</div>
                    <p className="text-gray-600">{day.temp}°C</p>
                    <p className="text-sm text-gray-500">{day.condition}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Compliance Status */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaFileAlt className="mr-2 text-green-600" /> Compliance Status
            </h2>
            {complianceData.length === 0 ? (
              <p className="text-gray-600">No compliance data available.</p>
            ) : (
              <ul className="space-y-4 max-h-60 overflow-y-auto">
                {complianceData.map((doc) => (
                  <motion.li
                    key={`${doc.vehicleId}-${doc.document}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg flex justify-between items-center ${
                      doc.status === 'Valid' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div>
                      <p className="text-gray-800 font-medium">{doc.vehicleId}</p>
                      <p className="text-sm text-gray-600">{doc.document}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${doc.status === 'Valid' ? 'text-green-700' : 'text-red-700'}`}>
                        {doc.status}
                      </p>
                      <p className="text-sm text-gray-500">Expires: {new Date(doc.expires).toLocaleDateString()}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Video Tutorial and Maintenance Alerts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Video Tutorial */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaPlayCircle className="mr-2 text-green-600" /> Video Tutorial
            </h2>
            <VideoPlayer />
          </div>

          {/* Maintenance Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50">
            <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
              <FaTools className="mr-2 text-green-600" /> Maintenance Alerts
            </h2>
            {stats.maintenanceDue === 0 ? (
              <p className="text-gray-600">No vehicles due for maintenance.</p>
            ) : (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaTools className="text-yellow-600" />
                  <p className="text-gray-800">
                    {stats.maintenanceDue} vehicle{stats.maintenanceDue > 1 ? 's' : ''} due for maintenance.
                  </p>
                </div>
                <button
                  onClick={() => handleQuickAction("/vehicles")}
                  className="text-green-600 hover:underline"
                >
                  View Details
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Live Chat with Drivers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
          className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200 bg-gradient-to-br from-white to-teal-50"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-900 flex items-center">
              <FaCommentDots className="mr-2 text-green-600" /> Live Chat with Drivers
            </h2>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="text-green-600 hover:underline"
            >
              {isChatOpen ? 'Close Chat' : 'Open Chat'}
            </button>
          </div>
          {isChatOpen && (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-3 ${msg.sender === 'Transport Manager' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        msg.sender === 'Transport Manager' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.sender}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatInputRef} />
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}