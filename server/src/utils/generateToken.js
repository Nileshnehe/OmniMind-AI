import jwt from "jsonwebtoken";
import crypto from "crypto";
import Token from "../models/token.model.js";

// 1. Generate Short-Lived Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_ACCESS_TOKEN, 
    { expiresIn: "15m" } // Production best practice window
  );
};

// 2. Generate Long-Lived Refresh Token / Crypto Strings
export const generateRandomToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// 3. Hash Token Utility (For security abstraction)
export const hashToken = (rawToken) => {
  return crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
};

// 4. Save/Update Refresh Token in DB
export const saveRefreshToken = async (userId, rawToken) => {
  if (!rawToken) {
    throw new Error("Cannot save token: rawToken is missing");
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days duration
  const hashedToken = hashToken(rawToken);

  // Re-login behavior: purane existing sessions clear karo
  await Token.deleteMany({ userId });

  // Store encrypted state
  await Token.create({
    userId,
    token: hashedToken,
    expiresAt,
  });
};