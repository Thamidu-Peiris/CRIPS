const TermsAndPolicy = require("../../models/SM/TermsAndPolicy");

// Initialize default documents if they don't exist
exports.initializeTermsAndPolicy = async (req, res) => {
  try {
    // Check if Terms and Conditions exists, if not create a default one
    let terms = await TermsAndPolicy.findOne({ type: "terms" });
    if (!terms) {
      terms = new TermsAndPolicy({
        type: "terms",
        content: "Default Terms and Conditions content. Please customize as needed.",
        updatedBy: "System",
      });
      await terms.save();
      console.log("Default Terms and Conditions initialized");
    }

    // Check if Privacy Policy exists, if not create a default one
    let privacy = await TermsAndPolicy.findOne({ type: "privacy" });
    if (!privacy) {
      privacy = new TermsAndPolicy({
        type: "privacy",
        content: "Default Privacy Policy content. Please customize as needed.",
        updatedBy: "System",
      });
      await privacy.save();
      console.log("Default Privacy Policy initialized");
    }

    res.status(200).json({ success: true, message: "Terms and Policy initialized" });
  } catch (error) {
    console.error("Error initializing Terms and Policy:", error);
    res.status(500).json({ success: false, message: "Error initializing Terms and Policy", error: error.message });
  }
};

// Get Terms and Conditions and Privacy Policy
exports.getTermsAndPolicy = async (req, res) => {
  try {
    const terms = await TermsAndPolicy.findOne({ type: "terms" });
    const privacy = await TermsAndPolicy.findOne({ type: "privacy" });

    res.status(200).json({
      success: true,
      data: {
        terms: terms ? terms.content : "Terms and Conditions not set",
        privacy: privacy ? privacy.content : "Privacy Policy not set",
        termsUpdatedAt: terms ? terms.updatedAt : null,
        privacyUpdatedAt: privacy ? privacy.updatedAt : null,
        termsUpdatedBy: terms ? terms.updatedBy : null,
        privacyUpdatedBy: privacy ? privacy.updatedBy : null,
      },
    });
  } catch (error) {
    console.error("Error fetching Terms and Policy:", error);
    res.status(500).json({ success: false, message: "Error fetching Terms and Policy", error: error.message });
  }
};

// Update Terms and Conditions or Privacy Policy
exports.updateTermsAndPolicy = async (req, res) => {
  const { type, content } = req.body;
  const user = req.user; // From authMiddleware

  if (!["terms", "privacy"].includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid type. Must be 'terms' or 'privacy'" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ success: false, message: "Content cannot be empty" });
  }

  try {
    const updateData = {
      content: content.trim(),
      updatedAt: Date.now(),
      updatedBy: user.username || user.email || "System Manager",
    };

    const document = await TermsAndPolicy.findOneAndUpdate(
      { type },
      updateData,
      { new: true, upsert: true } // Upsert creates a new document if it doesn't exist
    );

    res.status(200).json({ success: true, message: `${type === "terms" ? "Terms and Conditions" : "Privacy Policy"} updated successfully`, data: document });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    res.status(500).json({ success: false, message: `Error updating ${type}`, error: error.message });
  }
};