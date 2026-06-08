import { loginUser, registerUser } from "../services/auth.service.js";


const COOKIES_OPTION = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 100
}

export const registerController = async (req, res, next) => {
    try {
        const {user, accessToken, refreshToken} = await registerUser(req.body);

        res.cookie("refreshToken", refreshToken, COOKIES_OPTION);

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            data: {userId: user._id, accessToken}
        })

    } catch (error) {
        next(error)
    }
}

export const loginController = async (req, res, next) => {
    try {

        const {user, accessToken, refreshToken} = await loginUser(req.body);
        res.cookie("refreshToken", refreshToken, COOKIES_OPTION);

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {userId: user._id, accessToken}
        })

    } catch (error) {
        next(error)
    }
}