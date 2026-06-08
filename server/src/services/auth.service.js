import bcrypt from "bcrypt"
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, saveRefreshToken } from "../utils/generateToken.js";


const SALT_ROUNDS = 12;


export const registerUser = async ({ name, email, password }) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error("An account with this email already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await saveRefreshToken(user._id, refreshToken)

    return {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
    };
};

export const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email });
    if (!user) {

        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

        const err = new Error("Invalid email or password");
        err.statusCode = 401;
        throw err
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await saveRefreshToken(user._id, refreshToken);

    return {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
    }
}