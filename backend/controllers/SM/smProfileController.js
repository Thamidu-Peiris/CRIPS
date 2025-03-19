import SystemManager from "../../models/SM/SysManagerModel.js"; // Ensure this is your correct model

// Get System Manager Profile
export const getProfile = async (req, res) => {
    try {
        const managerId = req.user.id; // Assuming JWT authentication
        const systemManager = await SystemManager.findById(managerId).select("-Password"); // Exclude password

        if (!systemManager) {
            return res.status(404).json({ message: "System Manager not found" });
        }

        res.status(200).json(systemManager);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update System Manager Profile
export const updateProfile = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { UserName, Email, Contact_No, DOB, Address } = req.body;

        const updatedProfile = await SystemManager.findByIdAndUpdate(
            managerId,
            { UserName, Email, Contact_No, DOB, Address },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
