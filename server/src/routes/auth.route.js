import express, { Router } from "express";
import { loginController, registerController } from "../controller/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.js";


const router = Router()


router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController)
export default router;