import React, { useState } from "react";

const AssignTasks = () => {
  const [taskData, setTaskData] = useState({
    taskName: "",
    cutterName: "",
    priority: "",
    dueDate: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

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
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        console.log("Task assigned successfully!");
        setIsSuccess(true);

        setTaskData({
          taskName: "",
          priority: "",
          dueDate: "",
        });
      } else {
        console.error("Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
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
            <input
              type="text"
              name="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              required
              placeholder="Task Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />
            {/* Cutter Name */}
              <input
              type="text"
              name="cutterName"
              value={taskData.cutterName}
              onChange={handleChange}
              required
              placeholder="Cutter Name"
              className="w-full p-2 border rounded text-black placeholder-black"
            />



            {/* Priority Level Dropdown */}
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

            {/* Due Date Calendar */}
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              placeholder="Deadline"
              required
              className="w-full p-2 border rounded text-black"
            />

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
        </div>
      </div>
    </div>
  );
};

export default AssignTasks;
