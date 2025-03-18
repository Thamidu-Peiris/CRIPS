import express from "express";
import { loginSystemManager, registerSystemManager } from "../controllers/adminController.js";
import { getProfile, updateProfile } from "../controllers/adminProfileController.js";


const router = express.Router();

router.post("/register", registerSystemManager); // ✅ Register new system manager
router.get("/profile", getProfile);  // ✅ Get profile data
router.put("/profile", updateProfile); // ✅ Update profile 

export default router;