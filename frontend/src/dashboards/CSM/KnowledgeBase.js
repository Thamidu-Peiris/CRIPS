// frontend\src\dashboards\CSM\KnowledgeBase.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlusCircle } from "react-icons/fi";
import CSMSidebar from "../../components/CSMSidebar";
import CSMNavbar from "../../components/CSMNavbar";

const KnowledgeBase = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState(null);

  // Fetch FAQs from API
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faqs");
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  // Add New FAQ
  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return alert("Please fill out both fields.");

    try {
      const response = await axios.post("http://localhost:5000/api/faqs", newFaq);
      setFaqs([...faqs, response.data]);
      setNewFaq({ question: "", answer: "" });
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  // Edit FAQ
  const updateFaq = async () => {
    if (!editingFaq.question || !editingFaq.answer) return alert("Please fill out both fields.");

    try {
      const response = await axios.put(`http://localhost:5000/api/faqs/${editingFaq._id}`, editingFaq);
      setFaqs(faqs.map(faq => (faq._id === editingFaq._id ? response.data : faq)));
      setEditingFaq(null);
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  // Delete FAQ
  const deleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CSMSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <CSMNavbar />

        {/* Content Section */}
        <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-green-700 text-center"></h2>

          {/* Add New FAQ */}
          <div className="mt-6 border p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Add New FAQ</h3>
            <input
              type="text"
              placeholder="Enter Question"
              className="w-full p-2 border rounded-lg mt-2"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            />
            <textarea
              placeholder="Enter Answer"
              className="w-full p-2 border rounded-lg mt-2 h-24"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            ></textarea>
            <button
              onClick={addFaq}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            >
              <FiPlusCircle className="mr-2" /> Add FAQ
            </button>
          </div>

          {/* FAQs List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Frequently Asked Questions</h3>
            {faqs.length > 0 ? (
              <ul className="mt-3">
                {faqs.map((faq) => (
                  <li key={faq._id} className="border p-4 rounded-lg flex justify-between items-center mt-2">
                    {editingFaq?._id === faq._id ? (
                      // Edit Mode
                      <div className="w-full">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg mb-2"
                          value={editingFaq.question}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        />
                        <textarea
                          className="w-full p-2 border rounded-lg"
                          value={editingFaq.answer}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        ></textarea>
                        <button
                          onClick={updateFaq}
                          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      // Display Mode
                      <div>
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => deleteFaq(faq._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center mt-3">No FAQs available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBase;