import express from "express";
import { registerController } from "../controller/auth.controller.js";
import { loginController } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.get("/healthz", (req, res) => {
    try {
        res.status(200).json({ message: "ok" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)

export default authRouter;