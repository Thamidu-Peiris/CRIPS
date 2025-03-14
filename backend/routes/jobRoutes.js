const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const JobApplication = require("../models/JobApplication");

// 📌 Fetch Profile by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await JobApplication.findById(req.params.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


// 📌 Update Profile
router.put("/profile/update/:id", async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber } = req.body;

    const updatedUser = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, address, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully!", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// 📌 Change Password
router.post("/profile/change-password/:id", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await JobApplication.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// 📌 Save job applications
router.post("/apply", async (req, res) => {
  try {
    const { jobTitle, firstName, lastName, username, address, phoneNumber, email, password } = req.body;

    if (!jobTitle || !firstName || !lastName || !username || !address || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await JobApplication.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newApplication = new JobApplication({
      jobTitle,
      firstName,
      lastName,
      username,
      address,
      phoneNumber,
      email,
      password: hashedPassword,
      role: jobTitle,
    });

    await newApplication.save();
    res.status(201).json({ success: true, message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// 📌 Employee Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await JobApplication.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
