import { Router } from "express";
import { 
  registerController, 
  loginController, 
  verifyEmailController, 
  getMeController, 
  refreshTokenController, 
  logoutController 
} from "../controller/auth.controller.js";

// Middlewares imports
import validate from "../middlewares/validate.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

// Validation rules inputs mapping
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

// 1. REGISTER: Payload validate hoga, rate-limiter chalega
router.post("/register", authRateLimiter, validate(registerSchema), registerController);

// 2. LOGIN: Credentials check honge aur brute protection processing active rahegi
router.post("/login", authRateLimiter, validate(loginSchema), loginController);

// 3. EMAIL VERIFICATION: Query string link handling (e.g., /verify-email?token=xyz)
router.get("/verify-email", verifyEmailController);

// 4. GET ME: Protected route, access token validity layer checks
router.get("/me", isAuthenticated, getMeController);

// 5. REFRESH TOKEN: Cookie mapping validation se naya access token generate karega
router.post("/refresh-token", refreshTokenController);

// 6. LOGOUT: Database session aur tracking cookies wipe execution stream
router.post("/logout", logoutController);

export default router;