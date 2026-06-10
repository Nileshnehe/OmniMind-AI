import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { 
  registerUser, 
  loginUser, 
  verifyEmailToken, 
  rotateRefreshToken 
} from "../services/auth.service.js";

// Cookie configurations rules schema mapping
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days tracking frame
};

// 1. REGISTER
export const registerController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);
    
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    
    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: { userId: user._id, accessToken }
    });
  } catch (error) {
    next(error);
  }
};

// 2. VERIFY EMAIL
export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.query;
    await verifyEmailToken(token);

    return res.status(200).json({
      success: true,
      message: "Email verification successful! Your account is activated."
    });
  } catch (error) {
    next(error);
  }
};

// 3. LOGIN
export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    
    return res.status(200).json({ 
      success: true,
      message: "Logged in successfully",
      data: { userId: user._id, accessToken }
    });
  } catch (error) {
    next(error);
  }
};

// 4. GET ME (Optimized with lean for fast tracking)
export const getMeController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password -verificationToken -verificationTokenExpires -__v")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User context not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// 5. REFRESH TOKEN ROUTATION
export const refreshTokenController = async (req, res, next) => {
  try {
    const clientCookieToken = req.cookies.refreshToken;
    const { accessToken, refreshToken } = await rotateRefreshToken(clientCookieToken);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      message: "Tokens regenerated effectively",
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
};

// 6. LOGOUT (Complete clearance mechanism)
export const logoutController = async (req, res, next) => {
  try {
    const clientCookieToken = req.cookies.refreshToken;

    if (clientCookieToken) {
      const { hashToken } = await import("../utils/generateToken.js");
      const hashedToken = hashToken(clientCookieToken);
      
      // Wipe current tracking state from cluster database completely
      await Token.deleteOne({ token: hashedToken });
    }

    // Clearance client cookies state
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully from session thread"
    });
  } catch (error) {
    next(error);
  }
};