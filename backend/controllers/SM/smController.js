// CRIPS\backend\controllers\SM\smController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SystemManager from "../../models/SM/SysManagerModel.js";

export const loginSystemManager = async (req, res) => {
    console.log("Login request received:", req.body);

    try {
        if (!SystemManager) {
            console.error("SystemManager model is not defined");
            return res.status(500).json({ message: "Server Error", error: "SystemManager model is missing" });
        }

        const { username, password } = req.body;
        const systemManager = await SystemManager.findOne({ username });

        if (!systemManager) {
            console.log("System Manager not found:", username);
            return res.status(404).json({ message: "System Manager not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, systemManager.password);

        if (!isPasswordValid) {
            console.log("Invalid password attempt for:", username);
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: systemManager._id, role: "SystemManager" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Create userInfo object to return
        const userInfo = {
            id: systemManager._id,
            email: systemManager.email,
            username: systemManager.username,
            firstName: systemManager.firstName || "",
            lastName: systemManager.lastName || "",
            profileImage: systemManager.profileImage || "",
            role: "SystemManager",
            token, // Include the token
        };

        console.log("Login successful for:", username);
        res.json({ message: "Login successful", token, user: userInfo });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

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