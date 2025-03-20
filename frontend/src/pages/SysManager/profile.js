// CRIPS\frontend\src\pages\SysManager\profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sideBar";

const Profile = () => {
    const [admin, setAdmin] = useState({ UserName: "", Email: "", Contact_No: "", DOB: "", Address: "" });
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...admin });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:4000/api/admins/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmin(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:4000/api/admins/profile", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Profile updated successfully");
            setEditing(false);
            fetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 min-h-screen bg-gray-100 p-10 w-full flex justify-center items-start">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                    <h1 className="text-3xl font-bold mb-6 text-center">Admin Profile</h1>
                    
                    {!editing ? (
                        <div>
                            <p className="text-lg font-medium mb-2">Username: {admin.UserName}</p>
                            <p className="text-lg font-medium mb-2">Email: {admin.Email}</p>
                            <p className="text-lg font-medium mb-2">Contact: {admin.Contact_No}</p>
                            <p className="text-lg font-medium mb-2">DOB: {admin.DOB}</p>
                            <p className="text-lg font-medium mb-4">Address: {admin.Address}</p>
                            <button
                                onClick={() => setEditing(true)}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Username</label>
                                <input type="text" name="UserName" value={formData.UserName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input type="email" name="Email" value={formData.Email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Contact No</label>
                                <input type="text" name="Contact_No" value={formData.Contact_No} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">DOB</label>
                                <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-gray-700">Address</label>
                                <input type="text" name="Address" value={formData.Address} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Save Changes</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
