// frontend\src\dashboards\SalesReports\ProductPerformance.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SalesManagerNavbar from "../../components/SalesManagerNavbar";
import SalesManagerSidebar from "../../components/SalesManagerSidebar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductReport = () => {
  const [productData, setProductData] = useState([]);
  const [topSellingPlants, setTopSellingPlants] = useState([]);
  const [leastSellingPlants, setLeastSellingPlants] = useState([]);
  const [inventoryTableData, setInventoryTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductPerformance = async () => {
    setLoading(true);
    setError(null);

    const endDate = new Date().toISOString().split("T")[0];
    const startDate = "2020-01-01";
    const dashboardUrl = `${API_URL}/api/sales/dashboard-data?startDate=${startDate}&endDate=${endDate}`;
    const productUrl = `${API_URL}/api/sales/product-performance-report?startDate=${startDate}&endDate=${endDate}`;
    const inventoryUrl = `${API_URL}/api/stocks`;

    let inventoryData = [];
    let salesError = false;

    try {
      const dashboardResponse = await fetch(dashboardUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!dashboardResponse.ok) {
        const errorText = await dashboardResponse.text();
        throw new Error(`Dashboard API error! status: ${dashboardResponse.status}, message: ${errorText}`);
      }
      const dashboardDataRaw = await dashboardResponse.json();
      if (dashboardDataRaw.error) {
        throw new Error(`Dashboard API returned an error: ${dashboardDataRaw.error}${dashboardDataRaw.details ? ` - ${dashboardDataRaw.details}` : ''}`);
      }

      const productResponse = await fetch(productUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        throw new Error(`Product API error! status: ${productResponse.status}, message: ${errorText}`);
      }
      const productDataRaw = await productResponse.json();
      if (productDataRaw.error) {
        throw new Error(`Product API returned an error: ${productDataRaw.error}${productDataRaw.details ? ` - ${productDataRaw.details}` : ''}`);
      }

      const inventoryResponse = await fetch(inventoryUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!inventoryResponse.ok) {
        const errorText = await inventoryResponse.text();
        throw new Error(`Inventory API error! status: ${inventoryResponse.status}, message: ${errorText}`);
      }
      inventoryData = await inventoryResponse.json();

      const topPlantsUnits = Array.isArray(dashboardDataRaw.topPlantsUnits) ? dashboardDataRaw.topPlantsUnits : [];
      const products = Array.isArray(productDataRaw.products) ? productDataRaw.products : [];

      const productImageMap = {};
      products.forEach(product => {
        productImageMap[product.name.toLowerCase()] = product.image;
      });

      const salesMap = {};
      topPlantsUnits.forEach(plant => {
        salesMap[plant.name.toLowerCase()] = plant.unitsSold;
      });

      const allPlantsSet = new Set([
        ...products.map(product => product.name),
        ...inventoryData.map(stock => stock.plantName || stock.name),
        ...topPlantsUnits.map(plant => plant.name),
      ]);
      const allPlants = Array.from(allPlantsSet).map(name => ({
        name,
        unitsSold: salesMap[name.toLowerCase()] || 0,
        image: productImageMap[name.toLowerCase()] || "https://via.placeholder.com/150?text=Plant+Image",
      }));

      const sortedPlants = allPlants.sort((a, b) => b.unitsSold - a.unitsSold);

      const topSellingWithImages = sortedPlants
        .slice(0, 3)
        .filter(plant => plant.unitsSold > 0)
        .map(plant => ({
          name: plant.name,
          unitsSold: plant.unitsSold,
          image: plant.image,
        }));

      const topSellingNames = new Set(topSellingWithImages.map(plant => plant.name.toLowerCase()));
      const leastSellingCandidates = sortedPlants.filter(plant => !topSellingNames.has(plant.name.toLowerCase()));
      const leastSellingWithImages = leastSellingCandidates
        .filter(plant => plant.unitsSold > 0)
        .slice(-3)
        .reverse()
        .map(plant => ({
          name: plant.name,
          unitsSold: plant.unitsSold,
          image: plant.image,
        }));

      const salesTrend = sortedPlants
        .filter(plant => plant.unitsSold > 0)
        .map(plant => ({
          name: plant.name,
          value: plant.unitsSold,
        }));

      setProductData(salesTrend);
      setTopSellingPlants(topSellingWithImages);
      setLeastSellingPlants(leastSellingWithImages);

      let combinedData = [];
      if (sortedPlants.length > 0) {
        combinedData = sortedPlants.map(plant => {
          const plantName = plant.name || 'Unknown';
          const stock = inventoryData.find(s => {
            const stockName = (s.plantName || s.name || '').toLowerCase();
            return stockName === plantName.toLowerCase();
          });
          const remainingStock = stock && typeof stock.quantity === 'number' ? stock.quantity : 0;
          const unitsSold = typeof plant.unitsSold === 'number' ? plant.unitsSold : 0;
          const totalInventory = unitsSold + remainingStock;
          const soldPercentage = totalInventory > 0 ? ((unitsSold / totalInventory) * 100).toFixed(2) : 0;
          return {
            name: plantName,
            soldPercentage,
            unitsSold,
            remainingStock,
            stockQuantity: remainingStock,
          };
        }).filter(data => data.unitsSold > 0 || data.remainingStock > 0);
      } else {
        combinedData = inventoryData.map(stock => {
          const stockName = stock.plantName || stock.name || 'Unknown';
          const remainingStock = typeof stock.quantity === 'number' ? stock.quantity : 0;
          const unitsSold = 0;
          const totalInventory = unitsSold + remainingStock;
          const soldPercentage = totalInventory > 0 ? ((unitsSold / totalInventory) * 100).toFixed(2) : 0;
          return {
            name: stockName,
            soldPercentage,
            unitsSold,
            remainingStock,
            stockQuantity: remainingStock,
          };
        });
      }

      const allInventoryData = combinedData.sort((a, b) => {
        if (a.unitsSold !== b.unitsSold) {
          return b.unitsSold - a.unitsSold;
        }
        return (b.stockQuantity || 0) - (a.stockQuantity || 0);
      });
      setInventoryTableData(allInventoryData);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      setError(error.message);
      salesError = true;
    }

    if (salesError && inventoryData.length === 0) {
      try {
        const inventoryResponse = await fetch(inventoryUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!inventoryResponse.ok) {
          const errorText = await inventoryResponse.text();
          throw new Error(`Inventory API error (fallback)! status: ${inventoryResponse.status}, message: ${errorText}`);
        }
        inventoryData = await inventoryResponse.json();
      } catch (fallbackError) {
        setError(error.message + " | Fallback error: " + fallbackError.message);
        setLoading(false);
        return;
      }
    }

    if (salesError && inventoryData.length > 0) {
      const fallbackData = inventoryData.map(stock => {
        const stockName = stock.plantName || stock.name || 'Unknown';
        const remainingStock = typeof stock.quantity === 'number' ? stock.quantity : 0;
        const unitsSold = 0;
        const totalInventory = unitsSold + remainingStock;
        const soldPercentage = totalInventory > 0 ? ((unitsSold / totalInventory) * 100).toFixed(2) : 0;
        return {
          name: stockName,
          soldPercentage,
          unitsSold,
          remainingStock,
          stockQuantity: remainingStock,
        };
      });

      const allFallbackData = fallbackData.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
      setInventoryTableData(allFallbackData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProductPerformance();
    const intervalId = setInterval(fetchProductPerformance, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560", "#33FF57"];

  // Custom label renderer to position labels outside the pie chart with lines
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30; // Position labels 30px outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${productData[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="flex h-parent bg-gray-200">
      <SalesManagerSidebar />
      <main className="flex-1 p-6">
        <SalesManagerNavbar />
        <div className="flex justify-between items-center mb-6 mt-6">
          <h1 className="text-3xl font-bold text-green-600">Product Performance Report</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Top Selling Plants</h2>
            <div>
              {topSellingPlants.length > 0 ? (
                topSellingPlants.map((plant, index) => (
                  <div key={plant.name || index} className="flex items-center space-x-4 mb-5">
                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                      <img
                        src={plant.image || "https://via.placeholder.com/150?text=Plant+Image"}
                        alt={plant.name || 'Unknown'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Plant+Image";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{plant.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Units Sold: {plant.unitsSold || 0}</p>
                    </div>
                  </div>
                ))
              ) : loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <p className="text-gray-600">No top selling plants available. Please ensure there are completed customer orders in the database.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold mb-4">Least Selling Plants</h2>
            <div>
              {leastSellingPlants.length > 0 ? (
                leastSellingPlants.map((plant, index) => (
                  <div key={plant.name || index} className="flex items-center space-x-4 mb-5">
                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                      <img
                        src={plant.image || "https://via.placeholder.com/150?text=Plant+Image"}
                        alt={plant.name || 'Unknown'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Plant+Image";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{plant.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">Units Sold: {plant.unitsSold || 0}</p>
                    </div>
                  </div>
                ))
              ) : loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <p className="text-gray-600">No least selling plants available. Please ensure there are completed customer orders in the database.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-4">Sales Trend of Plants (Average)</h2>
            {productData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={true}
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} units`, props.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-gray-600">No sales trend data available. Please ensure there are completed customer orders in the database.</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-lg font-bold mb-4">Inventory Sold (%)</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : inventoryTableData.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="p-2">Plant Type</th>
                      <th className="p-2">Units Sold</th>
                      <th className="p-2">Stock Quantity</th>
                      <th className="p-2">Sold (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryTableData.map((plant, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{plant.name}</td>
                        <td className="p-2">{plant.unitsSold}</td>
                        <td className="p-2">{plant.stockQuantity || 0}</td>
                        <td className="p-2">{plant.soldPercentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">No stock data available. Please ensure there is stock data in the database.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-center items-center">
              <p className="font-bold text-lg mb-2">Export File</p>
              <h2 className="text-sm font-semibold mb-4 text-center">Download as CSV SpreadSheet or a PDF</h2>
              <Link
                to="/ReportHub"
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
              >
                Go to Report Hub
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductReport;