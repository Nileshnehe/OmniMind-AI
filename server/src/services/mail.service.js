import { configData } from "../config/config.js";
import nodemailer from "nodemailer";

function createTransporter() {
  // Validate that all required OAuth2 fields are present at creation time
  const { GOOGLE_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = configData;
  if (!GOOGLE_USER || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.error(
      "[mail.service] MISSING OAuth2 config fields:",
      { GOOGLE_USER: !!GOOGLE_USER, GOOGLE_CLIENT_ID: !!GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: !!GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN: !!GOOGLE_REFRESH_TOKEN }
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GOOGLE_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      // Never hard-code a short-lived accessToken here — let Nodemailer
      // use the refreshToken to obtain a fresh one automatically.
    },
    // Fail fast on Render / cloud environments instead of hanging for 60s
    connectionTimeout: 10_000, // 10 seconds to establish the TCP connection
    socketTimeout: 10_000,    // 10 seconds of inactivity before giving up
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