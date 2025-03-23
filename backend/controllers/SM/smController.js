// CRIPS\backend\controllers\SM\smController.js
import SystemManager from "../../models/SM/SysManagerModel.js";

// ... (registerSystemManager remains unchanged)

export const registerSystemManager = async (req, res) => {
    const { firstName, lastName, username, password, contactNo, dob, email, address } = req.body; // Changed to lowercase, added firstName and lastName

    try {
        const existingManager = await SystemManager.findOne({ $or: [{ username }, { email }] });
        if (existingManager) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const systemManager = new SystemManager({ firstName, lastName, username, password, contactNo, dob, email, address });
        await systemManager.save();
        res.status(201).json({ message: "System Manager registered successfully" });
    } catch (error) {
        console.error("Error registering System Manager:", error);
        res.status(500).json({ message: "Failed to register system manager", error: error.message });
    }
};

// Update Profile (Updated to include firstName and lastName)
export const updateProfile = async (req, res) => {
    try {
        console.log("updateProfile called in smController.js"); // Add this log
        const userId = req.user.id;
        console.log("User ID:", userId); // Add this log
        const { firstName, lastName, username, email, contactNo, dob, address } = req.body;
        console.log("Received update data:", { firstName, lastName, username, email, contactNo, dob, address }); // Add this log

        const updatedAdmin = await SystemManager.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                username,
                email,
                contactNo,
                dob,
                address,
            },
            { new: true, runValidators: true } // Add runValidators to ensure schema validation
        ).select("-password -createdAt -__v");

        if (!updatedAdmin) {
            console.log("System Manager not found for userId:", userId); // Add this log
            return res.status(404).json({ success: false, message: "System Manager not found" });
        }

        console.log("Updated admin:", updatedAdmin); // Existing log

        // Format the response to match the frontend's expectation
        const updatedProfile = {
            firstName: updatedAdmin.firstName,
            lastName: updatedAdmin.lastName,
            username: updatedAdmin.username,
            email: updatedAdmin.email,
            contactNo: updatedAdmin.contactNo,
            dob: updatedAdmin.dob ? updatedAdmin.dob.toISOString().split("T")[0] : "",
            address: updatedAdmin.address,
        };

        res.json({
            message: "Profile updated successfully",
            updatedProfile,
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getProfile = async (req, res) => {
    try {
        console.log("getProfile called in smProfileController.js");
        const userId = req.user.id;
        console.log("Fetching profile for userId:", userId);
        const admin = await SystemManager.findById(userId).select("-password -createdAt -__v");
        if (!admin) {
            return res.status(404).json({ success: false, message: "System Manager not found" });
        }
        res.json(admin);
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};