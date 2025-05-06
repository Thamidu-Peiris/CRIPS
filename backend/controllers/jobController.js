const JobApplication = require("../models/JobApplication");
const CustomerServiceManager = require("../models/csm/csmModel");
const GrowerHandler = require("../models/GrowerHandler/growerHandlerModel");
const Cutters = require("../models/cutters/cuttersModel");
const InventoryManager = require("../models/InventoryM/inventoryManagerModel");
const SalesManager = require("../models/salesManager/salesManagerModel");
const TransportManager = require("../models/TransportManager/TransportManagerModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Map job titles to models
const roleModelMap = {
  "Customer Service Manager": CustomerServiceManager,
  "Grower Handler": GrowerHandler,
  "Cutters": Cutters,
  "Inventory Manager": InventoryManager,
  "Sales Manager": SalesManager,
  "TransportManager": TransportManager,
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation regex (basic example, adjust as needed)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Function to send email
const sendThankYouEmail = async (to, firstName, jobTitle) => {
  try {
    console.log("Setting up transporter for thank you email...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "cripsaquaplants@gmail.com",
        pass: "yoogriibsdyqtdzu",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Verifying transporter connection...");
    await transporter.verify();
    console.log("Transporter is ready to send thank you email!");

    const subject = "Thank You for Applying at CRIPS!";
    const html = `
      <h3>Hello ${firstName},</h3>
      <p>Thank you for applying for the position of <b>${jobTitle}</b> at CRIPS Aqua Plant Export System.</p>
      <p>We have successfully received your application. Our team will review your submission, and we will inform you shortly regarding the next steps.</p>
      <p>In the meantime, you can check your application status at any time by visiting: <a href="http://localhost:3000/check-status">Check Application Status</a>.</p>
      <br/>
      <p>Best Regards,<br/>CRIPS System Manager</p>
    `;

    console.log("Preparing thank you email options...");
    const mailOptions = {
      from: '"CRIPS Aqua Plant Export" <cripsaquaplants@gmail.com>',
      to,
      subject,
      html,
    };
    console.log("Thank you email options prepared:", mailOptions);

    console.log("Attempting to send thank you email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Thank you email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending thank you email:", error);
    throw new Error("Failed to send thank you email");
  }
};

// Submit a job application
exports.submitJobApplication = async (req, res) => {
  try {
    // Log the entire request body and files for debugging
    console.log("Received Job Application Data:", req.body);
    console.log("Received Files:", req.files);

    const {
      jobTitle,
      firstName,
      lastName,
      username,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      email,
      password,
      startDate,
      termsAccepted,
    } = req.body;

    // Validate required fields (excluding username and password since they are generated)
    const requiredFields = [
      "jobTitle",
      "firstName",
      "lastName",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
      "phoneNumber",
      "email",
      "startDate",
      "termsAccepted",
    ];
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field] === "") {
        console.log(`Validation failed: Missing or empty required field: ${field}`);
        return res.status(400).json({ success: false, message: `Missing or empty required field: ${field}` });
      }
    }

    // Ensure username and password are provided by the frontend
    if (!username || !password) {
      console.log("Validation failed: Username or password not provided by frontend");
      return res.status(400).json({ success: false, message: "Username and password must be generated and provided" });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      console.log(`Validation failed: Invalid email format - Email: ${email}`);
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Validate phone number format
    if (!phoneRegex.test(phoneNumber)) {
      console.log(`Validation failed: Invalid phone number format - Phone: ${phoneNumber}`);
      return res.status(400).json({ success: false, message: "Invalid phone number format (e.g., +1234567890)" });
    }

    // Validate startDate (must be in the future)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
    const selectedStartDate = new Date(startDate);
    selectedStartDate.setHours(0, 0, 0, 0); // Normalize to start of day
    if (selectedStartDate <= today) {
      console.log("Validation failed: Start date must be in the future");
      return res.status(400).json({ success: false, message: "Start date must be in the future" });
    }

    // Combine address fields into a single string
    const address = `${addressLine1}${addressLine2 ? ", " + addressLine2 : ""}, ${city}, ${state}, ${postalCode}, ${country}`;

    // Validate termsAccepted
    if (termsAccepted !== "true" && termsAccepted !== true) {
      console.log("Validation failed: You must accept the terms and conditions");
      return res.status(400).json({ success: false, message: "You must accept the terms and conditions" });
    }

    // Check if the email or username is already in use in JobApplication
    const existingApplication = await JobApplication.findOne({ $or: [{ email }, { username }] });
    if (existingApplication) {
      console.log(`Validation failed: Email or username already in use - Email: ${email}, Username: ${username}`);
      return res.status(400).json({ success: false, message: "Email or username already in use" });
    }

    // Validate file uploads
    if (!req.files || !req.files.resume) {
      console.log("Validation failed: Resume file is required");
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the application to JobApplication
    const application = new JobApplication({
      jobTitle,
      firstName,
      lastName,
      username,
      address,
      phoneNumber,
      email,
      password: hashedPassword,
      role: jobTitle,
      startDate: selectedStartDate,
      coverLetter: req.files.coverLetter ? req.files.coverLetter[0].path : null,
      resume: req.files.resume[0].path,
      termsAccepted: termsAccepted === "true" || termsAccepted === true,
    });

    await application.save();
    console.log("Application saved to jobapplications collection:", application);

    // Send thank you email
    try {
      await sendThankYouEmail(email, firstName, jobTitle);
      console.log("Thank you email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send thank you email, but application saved:", emailError);
      // Note: We don't fail the request if the email fails; the application is already saved
    }

    console.log(`Application for ${jobTitle} will be saved to role-specific collection only after approval`);

    res.status(201).json({ success: true, message: "Application submitted successfully. Awaiting admin approval." });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ success: false, message: "Error submitting application", error: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    console.log("Fetching job applications for user:", req.user);
    const applications = await JobApplication.find();
    console.log("Fetched applications:", applications);
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: "Error fetching applications", error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const normalizedStatus = typeof status === "string" ? status.trim().toLowerCase() : status;
    console.log("Received status update request:", { id, status, normalizedStatus });

    if (!["pending", "approved", "rejected"].includes(normalizedStatus)) {
      console.log("Validation failed - Invalid status:", status, "Normalized:", normalizedStatus, "Expected: ['pending', 'approved', 'rejected']");
      return res.status(400).json({ success: false, message: "Invalid status. Must be pending, approved, or rejected" });
    }

    if (normalizedStatus === "rejected" && !reason) {
      console.log("Validation failed: Rejection reason is required");
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    const updateData = { status: normalizedStatus };
    if (normalizedStatus === "rejected") {
      updateData.rejectionReason = reason;
    } else {
      updateData.rejectionReason = null;
    }

    const application = await JobApplication.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!application) {
      console.log("Application not found for ID:", id);
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (normalizedStatus === "approved") {
      const RoleModel = roleModelMap[application.jobTitle];
      if (RoleModel) {
        const existingRoleEntry = await RoleModel.findOne({ email: application.email });
        if (!existingRoleEntry) {
          const roleApplication = new RoleModel({
            jobTitle: application.jobTitle,
            firstName: application.firstName,
            lastName: application.lastName,
            username: application.username,
            address: application.address,
            phoneNumber: application.phoneNumber,
            email: application.email,
            password: application.password,
            role: application.jobTitle,
          });
          await roleApplication.save();
          console.log(`Applicant added to ${application.jobTitle} collection after approval`);
        } else {
          console.log(`Applicant already exists in ${application.jobTitle} collection`);
        }
      } else {
        console.log(`No role-specific model found for jobTitle: ${application.jobTitle}`);
      }
    }

    console.log("Application status updated:", application);
    res.status(200).json({ success: true, message: "Application status updated", data: application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ success: false, message: "Error updating application status", error: error.message });
  }
};

exports.checkApplicationStatus = async (req, res) => {
  try {
    const { email, username } = req.query;
    if (!email && !username) return res.status(400).json({ success: false, message: "Email or username required" });
    const application = await JobApplication.findOne({ $or: [{ email }, { username }] });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.status(200).json({ success: true, data: { status: application.status || "Pending" } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking status" });
  }
};

// Delete a job application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id);
    if (!application) {
      console.log("Application not found for ID:", id);
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    console.log("Application deleted:", application);
    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ success: false, message: "Error deleting application", error: error.message });
  }
};