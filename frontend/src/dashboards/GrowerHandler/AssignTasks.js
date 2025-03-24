import React, { useState } from "react";

const AssignTasks = () => {
  const [taskData, setTaskData] = useState({
    taskName: "",
    cutterName: "",
    priority: "",
    dueDate: "",
    status: "Incomplete", // Default status
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const cutters = ["Alex", "Ben", "Cody", "Dan", "Evan"];
  const statuses = ["Incomplete", "In Progress", "Complete"]; // Status options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting task:", taskData);

    try {
      const response = await fetch("http://localhost:5000/api/grower/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      console.log("Response:", response);

      if (response.ok) {
        console.log("Task assigned successfully!");
        setIsSuccess(true);
        setError(null);

        // Reset form after successful submission
        setTaskData({
          taskName: "",
          cutterName: "",
          priority: "",
          dueDate: "",
          status: "Incomplete", // Reset to default
        });
      } else {
        const contentType = response.headers.get("content-type");
        let errorData;

        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          setError(errorData.message || "Failed to assign task");
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          setError("Unexpected response from server");
        }
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      setError("Error assigning task: " + error.message);
      setIsSuccess(false);
    }
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

      {/* Scrollable Form Container */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center">
        <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-md rounded-lg p-6 mt-4 mb-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold text-center mb-6">Assign a Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Name */}
            <div>
              <label className="block text-black mb-1">Task Name</label>
              <input
                type="text"
                name="taskName"
                value={taskData.taskName}
                onChange={handleChange}
                required
                placeholder="Task Name"
                className="w-full p-2 border rounded text-black placeholder-black"
              />
            </div>

            {/* Cutter Name Dropdown */}
            <div>
              <label className="block text-black mb-1">Cutter Name</label>
              <select
                name="cutterName"
                value={taskData.cutterName}
                onChange={handleChange}
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

            {/* Priority Level Dropdown */}
            <div>
              <label className="block text-black mb-1">Priority Level</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select Priority Level</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Due Date Calendar */}
            <div>
              <label className="block text-black mb-1">Deadline</label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded text-black"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-black mb-1">Status</label>
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Assign Task
            </button>
          </form>

          {/* Success Message */}
          {isSuccess && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 rounded text-center">
              Task assigned successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-200 text-red-800 rounded text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTasks;