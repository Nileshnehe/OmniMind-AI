import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import { configData } from "../config/config.js";

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "user already exists"
            });
        }

        
        const user = await userModel.create({ username, email, password });

        // 2. Validate secret exists before signing
        if (!configData.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not defined in configData!");
            return res.status(500).json({ success: false, message: "Internal server configuration error" });
        }

        
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            configData.JWT_SECRET,
            { expiresIn: '1d' } 
        );

        
        await sendEmail({
            to: email,
            subject: "Welcome to Omnimind AI",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email - Omnimind AI</title>
</head>
<body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                    
                    <!-- Top Gradient Header Bar -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); height: 6px;"></td>
                    </tr>

                    <!-- Main Body Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1e1b4b; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 20px;">Welcome to Omnimind AI!</h2>
                            
                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Hi <strong>${username}</strong>,</p>
                            
                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thank you for registering at <strong>Omnimind AI</strong>. We're incredibly excited to have you on board! Before we get started, we just need to verify your email address.</p>
                            
                            <!-- Call to Action Button -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" bgcolor="#4f46e5" style="border-radius: 8px;">
                                        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}" target="_blank" style="font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 14px 32px; display: inline-block; letter-spacing: 0.5px;">Verify Email Address</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 30px; font-style: italic;">If you did not create an account, you can safely ignore this email.</p>
                            
                            <!-- Footer Divider -->
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 25px;">
                            
                            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
                                Best regards,<br>
                                <strong style="color: #4f46e5;">The Omnimind AI Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Small Sub-Footer -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; margin-top: 20px; text-align: center;">
                    <tr>
                        <td>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; 2026 Omnimind AI. All rights reserved.</p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`
        }).catch(err => console.error("Welcome email failed:", err.message));

        // 5. Respond
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration."
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;


        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                err: "User not found"
            });
        }


        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                err: "Invalid credentials"
            });
        }


        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email before logging in",
                success: false,
                err: "Email not verified"
            });
        }


        if (!configData.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is missing in login configuration!");
            return res.status(500).json({ success: false, message: "Internal server error" });
        }

        
        const token = jwt.sign(
            { id: user._id, username: user.username },
            configData.JWT_SECRET,
            { expiresIn: '7d' }
        );


        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        };


        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during login."
        });
    }
}

export async function getMe(req, res) {
    try {
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized access. No user session found.",
                success: false,
                err: "Unauthorized"
            });
        }

        const userId = req.user.id;

        
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                err: "User not found"
            });
        }

        
        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            user
        });

    } catch (error) {
        console.error("GetMe Error:", error);

        
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID format."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching user details."
        });
    }
}


export async function verify(req, res) {
    const { token } = req.query
    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #f8fafc;
        }
        .container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2.5rem;
            border-radius: 16px;
            text-align: center;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }
        .icon-box {
            width: 72px;
            height: 72px;
            background: rgba(34, 197, 94, 0.2);
            border: 2px solid #22c55e;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 1.5rem auto;
            color: #22c55e;
            font-size: 2rem;
        }
        h1 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #ffffff;
            font-weight: 600;
        }
        p {
            color: #94a3b8;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 0.8rem 2rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.5);
            opacity: 0.95;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="icon-box">
            ✓
        </div>
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now close this tab or head back to login to access your account.</p>
       
    </div>

</body>
</html>
`;

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}



export async function logout(req, res) {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully from session thread"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
};


