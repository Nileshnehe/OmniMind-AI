import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { 
  generateAccessToken, 
  generateRandomToken, 
  hashToken, 
  saveRefreshToken 
} from "../utils/generateToken.js";

const SALT_ROUNDS = 12;

// ==========================================
// 1. REGISTER SERVICE (with Email Verification Logic)
// ==========================================
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Email verification ke liye tokens aur expiry generate karo
  const verificationToken = generateRandomToken();
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours valid

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false, // Default false rahega jab tak mail verify na ho
    verificationToken: hashToken(verificationToken), // Securely hash karke store karo
    verificationTokenExpires
  });

  // -------------------------------------------------------------
  // 📧 PRODUCTION EMAIL VERIFICATION PLACEHOLDER
  // -------------------------------------------------------------
  // Yahan aap nodemailer ya SendGrid ka integrations code likh sakte hain.
  console.log(`\n📧 [EMAIL SENT SIMULATION] To: ${email}`);
  console.log(`🔗 Verification Link: http://localhost:3000/api/auth/verify-email?token=${verificationToken}\n`);
  // -------------------------------------------------------------

  // Tokens generate karo session maintain karne ke liye (Aap chaho toh verification ke baad bhi login karwa sakte ho)
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRandomToken();

  await saveRefreshToken(user._id, refreshToken);

  return {
    user,
    accessToken,
    refreshToken
  };
};

// ==========================================
// 2. EMAIL VERIFICATION SERVICE
// ==========================================
export const verifyEmailToken = async (rawToken) => {
  if (!rawToken) {
    const error = new Error("Verification token missing");
    error.statusCode = 400;
    throw error;
  }

  const hashedToken = hashToken(rawToken);

  // Check karo token valid aur non-expired hai ya nahi
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    const error = new Error("Invalid or expired verification token");
    error.statusCode = 400;
    throw error;
  }

  // Clear verification data and activate user status
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();

  return user;
};

// ==========================================
// 3. LOGIN SERVICE
// ==========================================
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRandomToken();

  await saveRefreshToken(user._id, refreshToken);

  return {
    user,
    accessToken,
    refreshToken
  };
};

// ==========================================
// 4. REFRESH TOKEN SERVICE (Industry Standard Validation)
// ==========================================
export const rotateRefreshToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  const hashedToken = hashToken(rawRefreshToken);

  // Db se matching live session token token nikalo
  const storedToken = await Token.findOne({ token: hashedToken });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    const error = new Error("Session expired or invalid refresh credentials");
    error.statusCode = 401;
    throw error;
  }

  // Generates fresh pairs (Token Rotation architecture mechanism)
  const newAccessToken = generateAccessToken(storedToken.userId);
  const newRefreshToken = generateRandomToken();

  // Old session wipe karke naya refresh token database map update karo
  await saveRefreshToken(storedToken.userId, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};