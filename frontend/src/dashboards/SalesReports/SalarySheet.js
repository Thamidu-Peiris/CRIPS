// frontend\src\dashboards\SalesReports\SalarySheet.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import jsPDF from "jspdf"; // For PDF export
import autoTable from "jspdf-autotable"; // Import autoTable directly

// Bind modal to your appElement for accessibility
Modal.setAppElement("#root");

const SalarySheet = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // State for form data (for adding new entries)
  const [month, setMonth] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("month") || new Date().getMonth() + 1;
  });
  const [year, setYear] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("year") || new Date().getFullYear();
  });
  const [entries, setEntries] = useState([
    { employeeName: "", designation: "", basicSalary: "", allowances: "", deductions: "", netSalary: "" },
  ]);

  // State for updating an entry
  const [updateEntry, setUpdateEntry] = useState(null);

  // State for salary sheet data
  const [salarySheet, setSalarySheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  // Fetch salary sheet data when the component mounts or month/year changes
  useEffect(() => {
    const fetchSalarySheet = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching salary sheet for month: ${month}, year: ${year}`);
        const response = await fetch(`http://localhost:5000/api/sales/salary-sheet?month=${month}&year=${year}`);
        const data = await response.json();
        console.log("Salary sheet response:", data);
        if (response.ok) {
          setSalarySheet(data);
        } else {
          console.error("Error fetching salary sheet:", data.error);
          setSalarySheet([]);
          setError(data.error || "Failed to fetch salary sheet");
        }
      } catch (error) {
        console.error("Error fetching salary sheet:", error);
        setSalarySheet([]);
        setError("Failed to connect to the server. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalarySheet();
  }, [month, year, refetch]);

  // Update month and year state when URL query parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newMonth = params.get("month");
    const newYear = params.get("year");
    if (newMonth && newYear) {
      setMonth(newMonth);
      setYear(newYear);
    }
  }, [location.search]);

  // Handle form input changes (for adding new entries)
  const handleInputChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;

    if (["basicSalary", "allowances", "deductions"].includes(field)) {
      const basic = Number(updatedEntries[index].basicSalary) || 0;
      const allowances = Number(updatedEntries[index].allowances) || 0;
      const deductions = Number(updatedEntries[index].deductions) || 0;
      updatedEntries[index].netSalary = basic + allowances - deductions;
    }

    setEntries(updatedEntries);
  };

  // Handle update form input changes
  const handleUpdateInputChange = (field, value) => {
    const updatedEntry = { ...updateEntry, [field]: value };

    if (["basicSalary", "allowances", "deductions"].includes(field)) {
      const basic = Number(updatedEntry.basicSalary) || 0;
      const allowances = Number(updatedEntry.allowances) || 0;
      const deductions = Number(updatedEntry.deductions) || 0;
      updatedEntry.netSalary = basic + allowances - deductions;
    }

    setUpdateEntry(updatedEntry);
  };

  // Add a new entry row (for adding new entries)
  const addEntry = () => {
    setEntries([...entries, { employeeName: "", designation: "", basicSalary: "", allowances: "", deductions: "", netSalary: "" }]);
  };

  // Remove an entry row (for adding new entries)
  const removeEntry = (index) => {
    console.log("Removing entry at index:", index);
    console.log("Current entries:", entries);
    if (entries.length > 1) {
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    }
  };

  // Handle form submission (for adding new entries)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("Submitting form with data:", { entries, month, year });

    try {
      const response = await fetch("http://localhost:5000/api/sales/salary-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, month, year }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        setIsAddModalOpen(false);
        setRefetch((prev) => !prev);
        navigate(`/SalarySheet?month=${month}&year=${year}`, { replace: true });
      } else {
        setError(data.error || "Failed to add salary sheet");
      }
    } catch (error) {
      console.error("Error adding salary sheet:", error);
      setError("Failed to connect to the server. Please check if the backend is running.");
    }
  };

  // Handle update form submission with custom confirmation modal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Open the confirmation modal
    setIsConfirmModalOpen(true);
  };

  // Handle confirmation from the custom modal
  const confirmUpdate = async () => {
    setIsConfirmModalOpen(false); // Close the confirmation modal

    console.log("Updating entry with data:", updateEntry);

    try {
      const response = await fetch(`http://localhost:5000/api/sales/salary-sheet/${updateEntry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateEntry),
      });

      const data = await response.json();
      console.log("Update response from backend:", data);

      if (response.ok) {
        setIsUpdateModalOpen(false);
        setUpdateEntry(null);
        setRefetch((prev) => !prev); // Trigger refetch
      } else {
        setError(data.error || "Failed to update salary sheet entry");
      }
    } catch (error) {
      console.error("Error updating salary sheet entry:", error);
      setError("Failed to connect to the server. Please check if the backend is running.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary sheet entry?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sales/salary-sheet/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("Delete response from backend:", data);

      if (response.ok) {
        setRefetch((prev) => !prev); // Trigger refetch
      } else {
        setError(data.error || "Failed to delete salary sheet entry");
      }
    } catch (error) {
      console.error("Error deleting salary sheet entry:", error);
      setError("Failed to connect to the server. Please check if the backend is running.");
    }
  };

  // Export to CSV (Manual CSV Generation)
  const exportToCSV = () => {
    if (salarySheet.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Define the headers
    const headers = [
      "Sr. No",
      "Name of Employee",
      "Designation",
      "Basic (Rs.)",
      "Allowances / OverTime (Rs.)",
      "Deductions (Rs.)",
      "Net Salary (Rs.)",
    ];

    // Map the data to CSV rows
    const rows = salarySheet.map((entry, index) => [
      index + 1,
      `"${entry.employeeName}"`, // Wrap in quotes to handle commas in names
      `"${entry.designation}"`,
      entry.basicSalary,
      entry.allowances || "-",
      entry.deductions || "-",
      entry.netSalary,
    ]);

    // Combine headers and rows into a CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SalarySheet_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Export to PDF
  // Updated: Export to PDF
  const exportToPDF = () => {
    if (salarySheet.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    const monthName = new Date(0, month - 1).toLocaleString("default", { month: "long" });

    // Add title
    doc.setFontSize(16);
    doc.text(`CRIPS Salary Sheet for ${monthName} ${year}`, 14, 20);

    // Define table columns
    const columns = [
      "Sr. No",
      "Name of Employee",
      "Designation",
      "Basic (Rs.)",
      "Allowances / OverTime (Rs.)",
      "Deductions (Rs.)",
      "Net Salary (Rs.)",
    ];

    // Map the salarySheet data to table rows
    const rows = salarySheet.map((entry, index) => [
      index + 1,
      entry.employeeName,
      entry.designation,
      entry.basicSalary,
      entry.allowances || "-",
      entry.deductions || "-",
      entry.netSalary,
    ]);

    // Use autoTable to generate the table
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      margin: { top: 30 },
    });

    // Save the PDF
    doc.save(`SalarySheet_${month}_${year}.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-[275px] bg-gray-300 p-5">
        <h2 className="text-xl font-bold mb-5">Side Bar</h2>
        <ul className="space-y-5">
          <li><Link to="/sales-manager-dashboard" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">🏠 Dashboard</Link></li>
          <li><Link to="/FinancialReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📉 Financial Report</Link></li>
          <li><Link to="/ProductReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📦 Products Report</Link></li>
          <li><Link to="/CustomerReport" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">👥 Customer Reports</Link></li>
          <li><Link to="/SalarySheet" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">💰 Employee Salary Sheet</Link></li>
          <li><Link to="/ReportHub" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300">📊 Reports Hub</Link></li>
          <li><Link to="/dashboard/settings" className="block px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition duration-300"> ⚙ Settings</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col justify-start">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600 mb-6">Employee Payroll</h1>
          <div>
            {/* Month and Year Selection */}
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                navigate(`/SalarySheet?month=${e.target.value}&year=${year}`);
              }}
              className="mr-2 p-2 border rounded"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                navigate(`/SalarySheet?month=${month}&year=${e.target.value}`);
              }}
              className="mr-2 p-2 border rounded"
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <button
              onClick={exportToCSV}
              className="bg-blue-500 text-white px-4 py-2 rounded-full mr-2"
            >
              Export to CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-purple-500 text-white px-4 py-2 rounded-full mr-2"
            >
              Export to PDF
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 px-4 py-2 rounded-full"
            >
              Add Salary Sheet
            </button>
          </div>
        </div>

        {/* Income Statement */}
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              CRIPS Salary Sheet for {new Date(0, month - 1).toLocaleString("default", { month: "long" })} {year}
            </h2>
          </div>

          {loading ? (
            <p className="text-center p-4">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center p-4">{error}</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Sr. No</th>
                  <th className="border border-gray-300 p-2">Name of Employee</th>
                  <th className="border border-gray-300 p-2">Designation</th>
                  <th className="border border-gray-300 p-2">Basic (Rs.)</th>
                  <th className="border border-gray-300 p-2">Allowances / OverTime (Rs.)</th>
                  <th className="border border-gray-300 p-2">Deductions (Rs.)</th>
                  <th className="border border-gray-300 p-2">Net Salary (Rs.)</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salarySheet.length > 0 ? (
                  salarySheet.map((entry, index) => (
                    <tr key={entry._id} className="text-center">
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{entry.employeeName}</td>
                      <td className="border border-gray-300 p-2">{entry.designation}</td>
                      <td className="border border-gray-300 p-2">{entry.basicSalary}</td>
                      <td className="border border-gray-300 p-2">{entry.allowances || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.deductions || "-"}</td>
                      <td className="border border-gray-300 p-2">{entry.netSalary}</td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => {
                            setUpdateEntry(entry);
                            setIsUpdateModalOpen(true);
                          }}
                          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      No salary sheet data available for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Adding Salary Sheet */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Add Salary Sheet</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>

          {entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-7 gap-2 mb-2">
              <input
                type="text"
                placeholder="Employee Name"
                value={entry.employeeName}
                onChange={(e) => handleInputChange(index, "employeeName", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={entry.designation}
                onChange={(e) => handleInputChange(index, "designation", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Basic Salary"
                value={entry.basicSalary}
                onChange={(e) => handleInputChange(index, "basicSalary", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Allowances"
                value={entry.allowances}
                onChange={(e) => handleInputChange(index, "allowances", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Deductions"
                value={entry.deductions}
                onChange={(e) => handleInputChange(index, "deductions", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Net Salary"
                value={entry.netSalary}
                readOnly
                className="p-2 border rounded bg-gray-100"
              />
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className={`bg-red-500 text-white p-2 rounded ${entries.length === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={entries.length === 1}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addEntry}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Another Employee
          </button>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Updating Salary Sheet Entry */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => {
          setIsUpdateModalOpen(false);
          setUpdateEntry(null);
        }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Update Salary Sheet Entry</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {updateEntry && (
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid grid-cols-6 gap-2 mb-2">
              <input
                type="text"
                placeholder="Employee Name"
                value={updateEntry.employeeName}
                onChange={(e) => handleUpdateInputChange("employeeName", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={updateEntry.designation}
                onChange={(e) => handleUpdateInputChange("designation", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Basic Salary"
                value={updateEntry.basicSalary}
                onChange={(e) => handleUpdateInputChange("basicSalary", e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Allowances"
                value={updateEntry.allowances}
                onChange={(e) => handleUpdateInputChange("allowances", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Deductions"
                value={updateEntry.deductions}
                onChange={(e) => handleUpdateInputChange("deductions", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Net Salary"
                value={updateEntry.netSalary}
                readOnly
                className="p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setUpdateEntry(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal for Confirming Update */}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-40"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Update</h2>
        <p className="mb-4">Are you sure you want to update this salary sheet entry?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsConfirmModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirmUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SalarySheet;