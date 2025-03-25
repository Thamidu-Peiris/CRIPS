import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deadlineSort, setDeadlineSort] = useState("Closest First");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();

  const cutters = ["Alex", "Ben", "Cody", "Dan", "Evan"];
  const priorities = ["All", "High", "Medium", "Low"];
  const statuses = ["All", "Incomplete", "In Progress", "Complete"];
  const deadlineSortOptions = ["Closest First", "Latest First"];

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch tasks when the component mounts
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
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            setError(errorData.message || "Failed to fetch tasks");
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
            setError("Unexpected response from server");
          }
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

  // Filter and sort tasks
  useEffect(() => {
    let updatedTasks = [...tasks];

    // Filter by priority
    if (priorityFilter !== "All") {
      updatedTasks = updatedTasks.filter(task => task.priority === priorityFilter);
    }

    // Filter by status
    if (statusFilter !== "All") {
      updatedTasks = updatedTasks.filter(task => task.status === statusFilter);
    }

    // Sort by deadline
    if (deadlineSort === "Closest First") {
      updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (deadlineSort === "Latest First") {
      updatedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    setFilteredTasks(updatedTasks);
  }, [priorityFilter, statusFilter, deadlineSort, tasks]);

  // Handle priority filter change
  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle deadline sort change
  const handleDeadlineSortChange = (e) => {
    setDeadlineSort(e.target.value);
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/grower/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setTasks(tasks.filter(task => task._id !== taskId));
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        setError("Error deleting task: " + error.message);
      }
    }
  };

  // Handle task update (start editing)
  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  // Handle action selection from dropdown
  const handleActionSelect = (action, task) => {
    if (action === "Update") {
      handleEdit(task);
    } else if (action === "Delete") {
      handleDelete(task._id);
    }
  };

  // Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask({
      ...editingTask,
      [name]: value,
    });
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/grower/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTask),
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

  // Check if deadline has passed (only for incomplete or in-progress tasks)
  const isDeadlinePassed = (dueDate, status) => {
    const isPastDue = new Date(dueDate) < currentDate;
    const isNotCompleted = status !== "Complete"; // Only mark as overdue if not completed
    return isPastDue && isNotCompleted;
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/AssignTaskBackground.mp4" type="video/mp4" />
      </video>

      {/* Scrollable Container */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center">
        <div className="max-w-5xl w-full bg-white bg-opacity-90 shadow-md rounded-lg p-6 mt-4 mb-4 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-center">Manage Tasks</h2>
            <button
              onClick={() => navigate("/dashboards/GrowerHandler")}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Filters and Sorting */}
          <div className="flex justify-between mb-4">
            <div className="flex space-x-4">
              <div>
                <label className="text-black mr-2">Filter by Priority:</label>
                <select
                  value={priorityFilter}
                  onChange={handlePriorityFilterChange}
                  className="p-2 border rounded text-black"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-black mr-2">Filter by Status:</label>
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
              <div>
                <label className="text-black mr-2">Sort by Deadline:</label>
                <select
                  value={deadlineSort}
                  onChange={handleDeadlineSortChange}
                  className="p-2 border rounded text-black"
                >
                  {deadlineSortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

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
            <div className="overflow-x-auto">
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
                          <option value="Update">Update</option>
                          <option value="Delete">Delete</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Update Task Form (Modal-like) */}
          {editingTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                <h3 className="text-xl font-semibold mb-4">Update Task</h3>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-black mb-1">Task Name</label>
                    <input
                      type="text"
                      name="taskName"
                      value={editingTask.taskName}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Cutter Name</label>
                    <select
                      name="cutterName"
                      value={editingTask.cutterName}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded text-black"
                    >
                      <option value="">Select Cutter</option>
                      {cutters.map((cutter) => (
                        <option key={cutter} value={cutter}>
                          {cutter}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-black mb-1">Priority</label>
                    <select
                      name="priority"
                      value={editingTask.priority}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded text-black"
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-black mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={new Date(editingTask.dueDate).toISOString().split("T")[0]}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Status</label>
                    <select
                      name="status"
                      value={editingTask.status}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded text-black"
                    >
                      {statuses.map((status) => (
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
    </div>
  );
};

export default ManageTasks;