import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route layer module injection
import authRoutes from "./routes/auth.route.js";

const app = express();

// 1. Base Middleware Layer setup Configurations
app.use(cors({
  origin: "http://localhost:5173", // Frontend endpoint target tracking URL
  credentials: true, // Cookies cross-origin propagation support activation
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Application Routes Mapping Wireframe
app.use("/api/auth", authRoutes); // Base route setup pattern

// Base Route for Health Check status evaluation
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "OK", timestamp: new Date() });
});

// 3. Global 404 Route Interceptor (Not Found routes handler)
app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "Requested API endpoint resource path does not exist on server thread"
  });
});

// 4. GLOBAL PRODUCTION ERROR HANDLER PIPELINE (Phase 3 core fallback execution)
app.use((err, req, res, next) => {
  console.error("💥 System Thread Error Log:", err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 409;
    message = "Resource duplicate violation conflict occurred (Email already exists)";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized token decoding operation integrity failure";
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;