const nodemailer = require("nodemailer");

exports.sendStatusNotification = async (req, res) => {
  const { to, name, role, status, rejectionReason, username, password } = req.body;
  console.log("✅ [DEBUG] Incoming Request Body:", req.body);

  try {
    console.log("✅ [DEBUG] Setting up transporter...");
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

    console.log("✅ [DEBUG] Verifying transporter connection...");
    await transporter.verify();
    console.log("✅ [DEBUG] Transporter is ready to send emails!");

    let subject = "";
    let html = "";

    if (status === "approved") {
      subject = "🎉 Your Employee Registration is Approved - Welcome to CRIPS!";
      html = `<h3>Hello ${name},</h3>
              <p>Congratulations! Your application for <b>${role}</b> has been <strong>approved</strong>.</p>
              <p>You can now log in to the <b>CRIPS Aqua Plant Export System</b> using the following credentials:</p>
              <p><b>Username:</b> ${username}</p>
              <p><b>Password:</b> ${password}</p>
              <p>Please keep these credentials secure and do not share them with anyone.</p>
              <p><b>Login Now:</b> <a href="http://localhost:3000/login">Click Here to Login</a></p>
              <br/>
              <p>Best Regards,<br/>CRIPS System Manager</p>`;
    } else if (status === "rejected") {
      subject = "❌ Your Employee Application was Rejected";
      html = `<h3>Hello ${name},</h3>
              <p>We regret to inform you that your application for <b>${role}</b> was <strong>rejected</strong>.</p>
              <p><b>Reason:</b> ${rejectionReason || "No specific reason provided."}</p>
              <p>If you have any questions, feel free to contact us.</p>
              <br/>
              <p>Best Regards,<br/>CRIPS System Manager</p>`;
    }

    console.log("✅ [DEBUG] Preparing mail options...");
    const mailOptions = {
      from: '"CRIPS Aqua Plant Export" <cripsaquaplants@gmail.com>',
      to,
      subject,
      html,
    };
    console.log("✅ [DEBUG] Mail Options Prepared:", mailOptions);

    console.log("✅ [DEBUG] Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [DEBUG] Email sent successfully! Message ID:", info.messageId);

    res.status(200).json({ success: true, message: "Notification email sent successfully!" });
  } catch (error) {
    console.error("❌ [DEBUG] Email sending error:", error);
    res.status(500).json({ success: false, message: "Failed to send status notification email", error: error.message });
  }
};