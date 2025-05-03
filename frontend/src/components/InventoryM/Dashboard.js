import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar";
import InventorySidebar from "./InventorySidebar";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({
    stockUpdateCount: { value: 0, text: "Stock Update Count" },
    totalSuppliers: { value: 0, text: "Total Suppliers" },
    expiringStocks: { value: 0, text: "Expiring Stocks" },
    recentSuppliers: { value: 0, text: "Recent Suppliers" },
  });
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  // Reusable function to calculate counts with custom condition and text
  const calculateCount = (data, condition, text) => {
    if (!Array.isArray(data)) {
      console.error(`Invalid data for ${text}: Expected an array`, data);
      return { value: 0, text };
    }
    const count = condition ? data.filter(condition).length : data.length;
    return { value: count, text };
  };

  const fetchData = async () => {
    try {
      // Fetch stocks
      try {
        const stockResponse = await axios.get("http://localhost:5000/api/inventory/plantstock/allPlantStocks");
        console.log("Stock API response:", stockResponse.data);
        const { stocks: stocksData } = stockResponse.data;
        if (!Array.isArray(stocksData)) {
          console.error("Invalid stock data: 'stocks' is not an array:", stocksData);
          throw new Error("Invalid stock data: Expected an array of stocks.");
        }
        setStocks(stocksData);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const stockUpdateCount = calculateCount(
          stocksData,
          (s) => {
            const updateDate = new Date(s.updatedAt || s.createdAt);
            return updateDate >= sevenDaysAgo;
          },
          "Stock Update Count"
        );
        const expiringStocks = calculateCount(
          stocksData,
          (s) => {
            if (!s.expirationDate) return false;
            const expirationDate = new Date(s.expirationDate);
            return expirationDate <= thirtyDaysFromNow && expirationDate >= new Date();
          },
          "Expiring Stocks"
        );
        setStats((prev) => ({ ...prev, stockUpdateCount, expiringStocks }));
      } catch (stockError) {
        console.error("Stock fetch error:", stockError.message);
        setAuthError(`Failed to fetch stocks: ${stockError.message}`);
        // Continue with other fetches
      }

      // Fetch suppliers
      try {
        const supplierResponse = await axios.get("http://localhost:5000/api/suppliers");
        console.log("Supplier API response:", supplierResponse.data);
        const suppliersData = supplierResponse.data;
        if (!Array.isArray(suppliersData)) {
          console.error("Invalid supplier data: Expected an array:", suppliersData);
          throw new Error("Invalid supplier data: Expected an array of suppliers.");
        }
        setSuppliers(suppliersData);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const totalSuppliers = calculateCount(suppliersData, null, "Total Suppliers");
        const recentSuppliers = calculateCount(
          suppliersData,
          (s) => new Date(s.createdAt) >= sevenDaysAgo,
          "Recent Suppliers"
        );
        setStats((prev) => ({ ...prev, totalSuppliers, recentSuppliers }));
      } catch (supplierError) {
        console.error("Supplier fetch error:", supplierError.message);
        setAuthError(prev => prev ? `${prev}; Failed to fetch suppliers: ${supplierError.message}` : `Failed to fetch suppliers: ${supplierError.message}`);
        // Continue
      }
    } catch (error) {
      console.error("Unexpected error in fetchData:", error.message);
      setAuthError(prev => prev ? `${prev}; Unexpected error: ${error.message}` : `Unexpected error: ${error.message}`);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No userId found in localStorage");
      setAuthError("Please log in to access the dashboard.");
      navigate("/login");
      return;
    }

    // Ensure userInfo exists for InventoryNavbar
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      console.log("No userInfo found in localStorage, setting default");
      localStorage.setItem("userInfo", JSON.stringify({ firstName: "Inventory", lastName: "Manager" }));
    }

    // Initial fetch
    fetchData();

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);

  // Stock Updates Over Time (Bar Chart)
  const getLast7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const barChartData = {
    labels: getLast7Days().map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "Stock Updates",
        data: getLast7Days().map(date => {
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          return stocks.filter(s => {
            const updateDate = new Date(s.updatedAt || s.createdAt);
            return updateDate >= startOfDay && updateDate <= endOfDay;
          }).length;
        }),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Stock Updates Over Time",
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: { padding: 10 },
        grid: { display: false },
      },
      y: { beginAtZero: true },
    },
  };

  // New Suppliers (Last 7 Days) (Bar Chart)
  const newSuppliersData = {
    labels: getLast7Days().map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "New Suppliers",
        data: getLast7Days().map(date => {
          const startOfDay = new Date(date);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          return suppliers.filter(s => {
            const createdDate = new Date(s.createdAt);
            return createdDate >= startOfDay && createdDate <= endOfDay;
          }).length;
        }),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const newSuppliersChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "New Suppliers (Last 7 Days)",
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: { padding: 10 },
        grid: { display: false },
      },
      y: { beginAtZero: true },
    },
  };

  // Stock Updates by Category (Pie Chart)
  const pieChartData = {
    labels: [...new Set(stocks.map(s => s.category || "Unknown"))],
    datasets: [
      {
        data: [...new Set(stocks.map(s => s.category || "Unknown"))].map(category => {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return stocks.filter(s => {
            const updateDate = new Date(s.updatedAt || s.createdAt);
            return (s.category || "Unknown") === category && updateDate >= sevenDaysAgo;
          }).length;
        }),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF4D6D",
          "#2F86D6",
          "#E6B800",
          "#3BA8A8",
          "#7A52CC",
          "#E68A00",
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Stock Updates by Category (Last 7 Days)",
        font: { size: 16 },
        padding: { top: 10, bottom: 20 },
      },
    },
  };

  const handleStocksClick = () => {
    navigate("/in-stock");
  };

  const handleSuppliersClick = () => {
    navigate("/suppliers");
  };

  // Get 3 latest stock updates
  const latestStocks = stocks
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <InventorySidebar />
      <main className="flex-1 p-6 ml-72">
        <InventoryNavbar />
        {authError && (
          <div className="bg-red-200 text-red-900 font-semibold p-4 rounded mb-6">
            {authError}
          </div>
        )}
        <h1 className="text-4xl font-bold text-green-800 mb-6"></h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {[
            { title: stats.stockUpdateCount.text, value: stats.stockUpdateCount.value, onClick: handleStocksClick, clickable: true },
            { title: stats.totalSuppliers.text, value: stats.totalSuppliers.value, onClick: handleSuppliersClick, clickable: true },
            { title: stats.expiringStocks.text, value: stats.expiringStocks.value, onClick: handleStocksClick, clickable: true },
            { title: stats.recentSuppliers.text, value: stats.recentSuppliers.value, onClick: handleSuppliersClick, clickable: true },
          ].map((item, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-2xl shadow-md text-center ${item.clickable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={item.onClick}
            >
              <h3 className="text-lg font-semibold text-green-800">{item.title}</h3>
              <p className="text-3xl font-bold text-green-600">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Bar data={newSuppliersData} options={newSuppliersChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md" style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Recent Stock Updates</h3>
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="py-3 px-4 border border-gray-300">Stock ID</th>
                  <th className="py-3 px-4 border border-gray-300">Plant Name</th>
                  <th className="py-3 px-4 border border-gray-300">Quantity</th>
                  <th className="py-3 px-4 border border-gray-300">Price ($)</th>
                  <th className="py-3 px-4 border border-gray-300">Expiration Date</th>
                  <th className="py-3 px-4 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {latestStocks.map((stock, index) => (
                  <tr key={stock._id} className="text-center border-b border-gray-300">
                    <td className="py-3 px-4">STOCK_{index + 1}</td>
                    <td className="py-3 px-4">{stock.plantName || "N/A"}</td>
                    <td className="py-3 px-4">{stock.quantity}</td>
                    <td className="py-3 px-4">{stock.itemPrice ? `$${stock.itemPrice}` : "N/A"}</td>
                    <td className="py-3 px-4">{stock.expirationDate ? new Date(stock.expirationDate).toLocaleDateString() : "N/A"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate("/inventory/in-stock")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}