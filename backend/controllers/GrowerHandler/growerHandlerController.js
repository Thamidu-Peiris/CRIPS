// backend/controllers/GrowerHandler/growerHandlerController.js
const GrowerHandler = require("../../models/GrowerHandler/growerHandlerModel");

// Fetch Grower Handler profile by ID
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching profile for Grower Handler with ID: ${userId}`);
    const profile = await GrowerHandler.findById(userId).select("-password");
    if (!profile) {
      console.log(`Profile not found for ID: ${userId}`);
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    console.log(`Profile fetched successfully:`, profile);
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching Grower Handler profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Grower Handler profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Updating profile for Grower Handler with ID: ${userId}`);

    const { firstName, lastName, address, phoneNumber } = req.body;
    const updateData = { firstName, lastName, address, phoneNumber };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`; // Assuming multer saves files to /uploads
    }

    const updatedProfile = await GrowerHandler.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedProfile) {
      console.log(`Profile not found for ID: ${userId}`);
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    console.log(`Profile updated successfully:`, updatedProfile);
    res.status(200).json({ success: true, message: "Profile updated successfully", updatedUser: updatedProfile });
  } catch (error) {
    console.error("Error updating Grower Handler profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Change Grower Handler password
exports.changePassword = async (req, res) => {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;
      console.log(`Changing password for Grower Handler with ID: ${userId}`);
  
      const user = await GrowerHandler.findById(userId);
      if (!user) {
        console.log(`User not found for ID: ${userId}`);
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log(`Invalid current password for ID: ${userId}`);
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      console.log(`Password changed successfully for ID: ${userId}`);
      res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };