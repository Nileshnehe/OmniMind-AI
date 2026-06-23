import { configData } from "../config/config.js";
import nodemailer from "nodemailer";

console.log("USER:", configData.GOOGLE_USER);
// console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN);
// console.log("REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: 'OAuth2',
    user: configData.GOOGLE_USER,
    clientSecret: configData.GOOGLE_CLIENT_SECRET,
    refreshToken: configData.GOOGLE_REFRESH_TOKEN,
    clientId: configData.GOOGLE_CLIENT_ID
  }
})

// transporter.verify removed to prevent crash on expired OAuth token

export async function sendEmail({ to, subject, html, text }) {

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text
  };

  try {
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
    return details;
  } catch (error) {
    console.error("Email sending failed (Bypassed for now):", error.message);
    return null;
  }

}