import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email: email },
        { username: username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email and username is already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({ username, email, password });

    await sendEmail({
        to: email,
        subject: "Welcome to Omnimind AI",
        html: `
        <p>Hi ${username},</p>
        <p>Thank You for registering at <strong>Omnimind AI</strong>. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
       
                <p>If you did not create an account, please ignore this email.</p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Omnimind AI Team</p>
        `
    }).catch(err => console.error("Welcome email failed:", err.message));

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })

}