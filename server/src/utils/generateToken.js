import jwt from "jsonwebtoken";
import crypto from "crypto";
import Token from "../models/token.model.js";

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    )
}
//  refresh token save in db 
export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex")
}

// Token save in db
export const saveRefreshToken = async (userId, rawToken) => {
    if (!rawToken) {
        throw new Error("Cannot save token: rawToken is undefined or missing");
    }
    console.log("User ID:", userId);
    console.log("Raw Token:", rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);



    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex")


    await Token.deleteMany({ userId })

    await Token.create({
        userId,
        token: hashedToken,
        expiresAt
    });
}