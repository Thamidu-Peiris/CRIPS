import React, { useEffect, useState } from "react";
import axios from "axios";
import CSMNavbar from "../../components/CSMNavbar";
import CSMSidebar from "../../components/CSMSidebar";

const CreateCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch all coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/csm/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
      setError("Failed to fetch coupons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to create a new coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { code, discountPercentage } = formData;

      // Validate inputs
      if (!code || !discountPercentage) {
        setError("Coupon code and discount percentage are required.");
        return;
      }
      if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
        setError("Discount percentage must be a number between 0 and 100.");
        return;
      }

      // Make API call to create coupon
      const res = await axios.post("http://localhost:5000/api/csm/coupons", {
        code: code.toUpperCase(),
        discountPercentage: parseFloat(discountPercentage),
      });

      // Update state with new coupon
      setCoupons([...coupons, res.data]);
      setFormData({ code: "", discountPercentage: "" });
      setSuccessMessage("Coupon created successfully!");
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to create coupon", err);
      setError("Failed to create coupon. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <CSMSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <CSMNavbar />

        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Manage Coupons
          </h2>

          {/* Coupon Creation Form */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Create New Coupon
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter coupon code (e.g., SAVE10)"
                />
              </div>
              <div>
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount Percentage
                </label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter discount percentage (0-100)"
                  min="0"
                  max="100"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Create Coupon
              </button>
            </form>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {

error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Coupons Table */}
          {!loading && !error && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="py-4 px-6 text-left text-sm font-semibold">
                      Coupon Code
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">
                      Discount Percentage
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 px-6 text-center text-gray-500"
                      >
                        No coupons available.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((coupon) => (
                      <tr
                        key={coupon._id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-700">
                          {coupon.code}
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {coupon.discountPercentage}%
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              coupon.isActive
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">
                          {new Date(coupon.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateCoupons;