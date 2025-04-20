// frontend\src\dashboards\Cutter\CutterDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CutterDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cutterFilter, setCutterFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();

  const cutters = ["All", "Alex", "Ben", "Cody", "Dan", "Evan"];
  const statuses = ["All", "Incomplete", "In Progress", "Complete"];

  // Update current date every second for overdue calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/grower/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          setFilteredTasks(data);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on cutter and status
  useEffect(() => {
    let updatedTasks = [...tasks];

    // Filter by cutter
    if (cutterFilter !== "All") {
      updatedTasks = updatedTasks.filter(task => task.cutterName === cutterFilter);
    }

    // Filter by status
    if (statusFilter !== "All") {
      updatedTasks = updatedTasks.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(updatedTasks);
  }, [cutterFilter, statusFilter, tasks]);

  // Calculate task counts for top boxes
  const getTaskCounts = () => {
    const complete = tasks.filter(task => task.status === "Complete").length;
    const inProgress = tasks.filter(task => task.status === "In Progress").length;
    const incomplete = tasks.filter(task => task.status === "Incomplete").length;
    const overdue = tasks.filter(task => isDeadlinePassed(task.dueDate, task.status)).length;

    return { complete, inProgress, incomplete, overdue };
  };

  // Handle cutter filter change
  const handleCutterFilterChange = (e) => {
    setCutterFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Check if deadline has passed (only for incomplete or in-progress tasks)
  const isDeadlinePassed = (dueDate, status) => {
    const isPastDue = new Date(dueDate) < currentDate;
    const isNotCompleted = status !== "Complete";
    return isPastDue && isNotCompleted;
  };

  // Handle task status update (start editing)
  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  // Handle action selection from dropdown
  const handleActionSelect = (action, task) => {
    if (action === "Update") {
      handleEdit(task);
    }
  };

  // Handle status change for editing
  const handleEditChange = (e) => {
    const { value } = e.target;
    setEditingTask({
      ...editingTask,
      status: value,
    });
  };

  // Handle update submission (send full task object)
const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/grower/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTask), // Send full task object
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task =>
          task._id === editingTask._id ? updatedTask.task : task
        ));
        setEditingTask(null);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task: " + error.message);
    }
  };

  const taskCounts = getTaskCounts();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* Navbar-like Header */}
      <div className="bg-white p-6 shadow-md">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Cutter Dashboard</h2>

        {/* Task Status Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Complete</h3>
            <p className="text-2xl font-bold text-green-600">{taskCounts.complete}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-2xl font-bold text-yellow-600">{taskCounts.inProgress}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Incomplete</h3>
            <p className="text-2xl font-bold text-red-600">{taskCounts.incomplete}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Overdue</h3>
            <p className="text-2xl font-bold text-purple-600">{taskCounts.overdue}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div>
              <label className="text-gray-700 mr-2">Filter by Cutter:</label>
              <select
                value={cutterFilter}
                onChange={handleCutterFilterChange}
                className="p-2 border rounded text-black"
              >
                {cutters.map((cutter) => (
                  <option key={cutter} value={cutter}>
                    {cutter}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-700 mr-2">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="p-2 border rounded text-black"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1">
        {loading && (
          <div className="text-center text-black">Loading tasks...</div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-200 text-red-800 rounded text-center">
            {error}
          </div>
        )}

        {!loading && !error && filteredTasks.length === 0 && (
          <div className="text-center text-black">No tasks found.</div>
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <div className="overflow-x-auto bg-white p-4 rounded-2xl shadow-md">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 text-black">Task Name</th>
                  <th className="border border-gray-300 p-2 text-black">Cutter Name</th>
                  <th className="border border-gray-300 p-2 text-black">Priority</th>
                  <th className="border border-gray-300 p-2 text-black">Due Date</th>
                  <th className="border border-gray-300 p-2 text-black">Status</th>
                  <th className="border border-gray-300 p-2 text-black">Created At</th>
                  <th className="border border-gray-300 p-2 text-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-black">{task.taskName}</td>
                    <td className="border border-gray-300 p-2 text-black">{task.cutterName}</td>
                    <td className="border border-gray-300 p-2 text-black">{task.priority}</td>
                    <td className="border border-gray-300 p-2 text-black">
                      {new Date(task.dueDate).toLocaleDateString()}
                      {isDeadlinePassed(task.dueDate, task.status) && (
                        <span className="ml-2 text-red-600 font-bold"> (Overdue!)</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      <span
                        className={
                          task.status === "Incomplete"
                            ? "text-red-600"
                            : task.status === "In Progress"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2 text-black">
                      <select
                        onChange={(e) => handleActionSelect(e.target.value, task)}
                        className="p-1 border rounded text-black"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Action
                        </option>
                        <option value="Update">Update Status</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Status Form (Modal-like) */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-xl font-semibold mb-4">Update Task Status</h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-black mb-1">Status</label>
                  <select
                    name="status"
                    value={editingTask.status}
                    onChange={handleEditChange}
                    required
                    className="w-full p-2 border rounded text-black"
                  >
                    {statuses.slice(1).map((status) => ( // Exclude "All" from options
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CutterDashboard;