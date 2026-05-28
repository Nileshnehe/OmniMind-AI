import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";


const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


export const generateAccessToken = (userId) => {
    return jwt.sign(
        {userId},
        ACCESS_SECRET,
        {expiresIn: "15m"}
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {userId},
        REFRESH_SECRET,
        {expiresIn: "7d"}
    );
    
};


