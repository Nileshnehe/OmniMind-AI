import { configData } from "../config/config.js";
import nodemailer from "nodemailer";

function createTransporter() {
  // Use Gmail App Password (SMTP) — stable on all environments including Render.
  // OAuth2 access tokens expire every 60 minutes and break on deployed servers.
  // To generate an App Password: Google Account → Security → 2-Step Verification → App Passwords
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: configData.GOOGLE_USER,
      pass: configData.GOOGLE_APP_PASSWORD,
    },
  });
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Omnimind AI" <${configData.GOOGLE_USER}>`,
    to,
    subject,
    html,
    text,
  };

  try {
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to, "| MessageId:", details.messageId);
    return details;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    // Re-throw so callers can handle/log the actual error
    throw error;
  }
}