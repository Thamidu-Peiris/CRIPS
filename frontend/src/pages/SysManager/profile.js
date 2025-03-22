// CRIPS\frontend\src\pages\SysManager\profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../dashboards/SM/sideBar";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaArrowLeft, FaEdit, FaSave, FaTimes, FaRedo } from "react-icons/fa";

const Profile = () => {
    const [admin, setAdmin] = useState({ UserName: "", Email: "", Contact_No: "", DOB: "", Address: "" });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...admin });
    const [managerName, setManagerName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.name) {
            setManagerName(user.name);
        } else {
            setManagerName("System Manager");
        }

        fetchProfile();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found. Please log in again.");
                navigate("/login");
                return;
            }
            const response = await axios.get("http://localhost:5000/api/admins/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Profile response:", response.data);
            setAdmin(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
            if (error.response?.status === 404) {
                setError("Profile endpoint not found. Please contact support.");
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                setError("Session expired or unauthorized. Please log in again.");
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
            } else if (error.code === "ERR_NETWORK") {
                setError("Unable to connect to the server. Please check your network or try again later.");
            } else {
                setError(error.response?.data?.message || "Failed to fetch profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/api/admins/profile", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage("Profile updated successfully!");
            setEditing(false);
            fetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                setError("Session expired or unauthorized. Please log in again.");
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setError(error.response?.data?.message || "Failed to update profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ ...admin });
        setEditing(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">System Manager Profile</h1>
                            <p className="text-lg mt-2">Welcome, {managerName}!</p>
                        </div>
                        <button
                            onClick={() => navigate("/system-manager-dashboard")}
                            className="flex items-center bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition duration-300"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Dashboard
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex justify-between items-center">
                        <p>{error}</p>
                        <button
                            onClick={fetchProfile}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-300"
                        >
                            <FaRedo className="mr-2" /> Retry
                        </button>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="flex justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full max-w-lg">
                        {loading ? (
                            <p className="text-center text-gray-600">Loading profile...</p>
                        ) : (
                            <>
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                        <FaUser className="text-4xl text-gray-500" />
                                    </div>
                                </div>

                                {!editing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <FaUser className="text-blue-500 mr-2" />
                                            <p className="text-lg font-medium text-gray-700">Username: <span className="font-normal">{admin.UserName}</span></p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-blue-500 mr-2" />
                                            <p className="text-lg font-medium text-gray-700">Email: <span className="font-normal">{admin.Email}</span></p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaPhone className="text-blue-500 mr-2" />
                                            <p className="text-lg font-medium text-gray-700">Contact: <span className="font-normal">{admin.Contact_No}</span></p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBirthdayCake className="text-blue-500 mr-2" />
                                            <p className="text-lg font-medium text-gray-700">DOB: <span className="font-normal">{admin.DOB}</span></p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-blue-500 mr-2" />
                                            <p className="text-lg font-medium text-gray-700">Address: <span className="font-normal">{admin.Address}</span></p>
                                        </div>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                                            disabled={loading}
                                        >
                                            <FaEdit className="mr-2" /> Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                                <FaUser className="mr-2 text-blue-500" /> Username
                                            </label>
                                            <input
                                                type="text"
                                                name="UserName"
                                                value={formData.UserName}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                                <FaEnvelope className="mr-2 text-blue-500" /> Email
                                            </label>
                                            <input
                                                type="email"
                                                name="Email"
                                                value={formData.Email}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                                <FaPhone className="mr-2 text-blue-500" /> Contact No
                                            </label>
                                            <input
                                                type="text"
                                                name="Contact_No"
                                                value={formData.Contact_No}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                                <FaBirthdayCake className="mr-2 text-blue-500" /> DOB
                                            </label>
                                            <input
                                                type="date"
                                                name="DOB"
                                                value={formData.DOB}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-blue-500" /> Address
                                            </label>
                                            <input
                                                type="text"
                                                name="Address"
                                                value={formData.Address}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <FaSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <FaTimes className="mr-2" /> Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;