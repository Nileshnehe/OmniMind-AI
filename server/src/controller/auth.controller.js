import { registerUser } from "../services/auth.service.js";

const COOKIES_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Auto handle for production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerController = async (req, res) => {
    
    try {
        const { user, accessToken, refreshToken } = await registerUser(req.body);
        
        res.cookie("refreshToken", refreshToken, COOKIES_OPTIONS);

        return res.status(201).json({
            success: true,
            message: "Registration Successfully",
            data: { user, accessToken }
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const loginController = async (req, res) => {

}

