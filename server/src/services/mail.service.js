import { configData } from "../config/config.js";
import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: configData.GOOGLE_USER,
      clientId: configData.GOOGLE_CLIENT_ID,
      clientSecret: configData.GOOGLE_CLIENT_SECRET,
      refreshToken: configData.GOOGLE_REFRESH_TOKEN,
      // accessToken: configData.GOOGLE_ACCESS_TOKEN,
    },
  });
}

export async function sendEmail({ to, subject, html, text }) {
  // Create a fresh transporter each time to avoid stale OAuth tokens
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