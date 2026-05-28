import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";


const SALT_ROUNDS = 10


export const registerUser = async ({ name, email, password }) => {

    const existing = await User.findOne({ email });
    if (existing){
        const err = new Error("An account with this email already exists");
        err.statusCode = 409;
        throw err;
    }

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        name,
        email,
        password:hashPassword
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await user.save()


   return {
        
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        accessToken,
        refreshToken
    };

}


// export const login = async ({email, password}) => {
// if(!email){

//     const err = new Error("Invalid email or password");
//     err.status(401);
//     throw err;
// }

// const isMatch = await bcrypt.compare(password, user.password)

// if(!isMatch){
//     const err = new Error("Invalid email or password");
//     err.status(401);
//     throw err;
// }

// const accessToken = generateAccessToken(user._id);
// const refreshToken = generateRefreshToken(user._id);

// await saveRefreshToken(user._id, refreshToken);

// return {
//     user: user.toSafeObject(),
//     accessToken,
//     refreshToken
// }
// }