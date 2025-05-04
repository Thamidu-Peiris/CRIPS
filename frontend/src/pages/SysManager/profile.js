import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../dashboards/SM/sideBar";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaArrowLeft, FaEdit, FaSave, FaTimes, FaRedo } from "react-icons/fa";

const Profile = () => {
    const [admin, setAdmin] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNo: "",
        dob: "",
        address: "",
    });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...admin });
    const [managerName, setManagerName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.firstName && user.lastName) {
            setManagerName(`${user.firstName} ${user.lastName}`);
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

    useEffect(() => {
        console.log("Admin state updated:", admin);
    }, [admin]);

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
            const response = await axios.get("http://localhost:5000/api/systemManagers/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Profile response:", response.data);

            const formattedData = {
                firstName: response.data.firstName || "",
                lastName: response.data.lastName || "",
                username: response.data.username || "",
                email: response.data.email || "",
                contactNo: response.data.contactNo || "",
                dob: response.data.dob ? new Date(response.data.dob).toISOString().split("T")[0] : "",
                address: response.data.address || "",
            };

            console.log("Formatted data:", formattedData);
            setAdmin(formattedData);
            setFormData(formattedData);

            if (response.data.firstName && response.data.lastName) {
                setManagerName(`${response.data.firstName} ${response.data.lastName}`);
            } else if (response.data.firstName) {
                setManagerName(response.data.firstName);
            } else {
                setManagerName("System Manager");
            }
        } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
            if (error.response?.status === 404) {
                setError("Profile endpoint not found. Please contact support or try again later.");
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
            const updatedData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                contactNo: formData.contactNo,
                dob: formData.dob,
                address: formData.address,
            };
            console.log("Sending update request to backend:", updatedData);
            console.log("Token:", token);
            const response = await axios.put("http://localhost:5000/api/systemManagers/profile", updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Backend response:", response.data);
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
        <div className="flex min-h-screen bg-teal-50 font-sans">
            <Sidebar />
            <div className="ml-64 flex-1 p-6">
                <div className="bg-gradient-to-r from-teal-300 to-teal-500 text-white p-6 rounded-xl shadow-md mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-green-900">System Manager Profile</h1>
                            <p className="text-xl mt-2 font-light text-gray-100">Welcome, {managerName}!</p>
                        </div>
                        <button
                            onClick={() => navigate("/sm-dashboard")}
                            className="flex items-center bg-gray-400 hover:bg-gray-500 text-white px-5 py-3 rounded-xl transition duration-300 shadow-md transform hover:scale-105 active:scale-95"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Dashboard
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl flex justify-between items-center shadow-md">
                        <p>{error}</p>
                        <button
                            onClick={fetchProfile}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition duration-300 transform hover:scale-105 active:scale-95"
                        >
                            <FaRedo className="mr-2" /> Retry
                        </button>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl shadow-md">
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="flex justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
                        {loading ? (
                            <p className="text-center text-gray-600">Loading profile...</p>
                        ) : (
                            <>
                                <div className="flex justify-center mb-8">
                                    <div className="relative w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform transition duration-300 hover:scale-110">
                                        <FaUser className="text-5xl text-white" />
                                        <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                                    </div>
                                </div>

                                {!editing ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center">
                                            <FaUser className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                First Name: <span className="font-normal text-gray-800">{admin.firstName || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUser className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                Last Name: <span className="font-normal text-gray-800">{admin.lastName || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUser className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                Username: <span className="font-normal text-gray-800">{admin.username || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                Email: <span className="font-normal text-gray-800">{admin.email || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaPhone className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                Contact: <span className="font-normal text-gray-800">{admin.contactNo || "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBirthdayCake className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                DOB: <span className="font-normal text-gray-800">{admin.dob ? new Date(admin.dob).toLocaleDateString() : "N/A"}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-green-500 mr-3 text-xl" />
                                            <p className="text-lg font-semibold text-gray-600">
                                                Address: <span className="font-normal text-gray-800">{admin.address || "N/A"}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95"
                                            disabled={loading}
                                        >
                                            <FaEdit className="mr-2" /> Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaUser className="mr-2 text-green-500" /> First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaUser className="mr-2 text-green-500" /> Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaUser className="mr-2 text-green-500" /> Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaEnvelope className="mr-2 text-green-500" /> Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaPhone className="mr-2 text-green-500" /> Contact No
                                            </label>
                                            <input
                                                type="text"
                                                name="contactNo"
                                                value={formData.contactNo}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaBirthdayCake className="mr-2 text-green-500" /> DOB
                                            </label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-gray-600 font-semibold mb-1 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-green-500" /> Address
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95"
                                                disabled={loading}
                                            >
                                                <FaSave className="mr-2" /> {loading ? "Saving..." : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-xl transition duration-300 flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95"
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