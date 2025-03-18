
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SystemManager from "../models/SM/SysManagerModel"; // ✅ Ensure correct path


export const loginSystemManager = async (req, res) => {
    console.log("Login request received:", req.body); // Debugging

    try {
        if (!SystemManager) {
            console.error("SystemManager model is not defined");
            return res.status(500).json({ message: "Server Error", error: "SystemManager model is missing" });
        }

        const { UserName, Password } = req.body;
        const systemManager = await SystemManager.findOne({ UserName });

        if (!systemManager) {
            console.log("System Manager not found:", UserName);
            return res.status(404).json({ message: "System Manager not found" });
        }

        const isPasswordValid = await bcrypt.compare(Password, systemManager.Password);

        if (!isPasswordValid) {
            console.log("Invalid password attempt for:", UserName);
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: systemManager._id, role: "SystemManager" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login successful for:", UserName);
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

export const registerSystemManager = async (req, res) => {
    const { UserName, Password, Contact_No, DOB, Email, Address } = req.body;

    try {
        const existingManager = await SystemManager.findOne({ UserName });
        if (existingManager) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const systemManager = new SystemManager({ UserName, Password, Contact_No, DOB, Email, Address });
        await systemManager.save();
        res.status(201).json({ message: "System Manager registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to register system manager", error: error.message });
    }
};