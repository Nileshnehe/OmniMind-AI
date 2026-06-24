import { configData } from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";

const app = express();

// Allowed origins: production Vercel URL + local dev
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
];
if (configData.FRONTEND_URL) {
    allowedOrigins.push(configData.FRONTEND_URL);
}

const corsOptions = {
    // Dynamically validate each request's Origin header against the allow-list.
    // Using a function (instead of a static array) is required when
    // credentials: true — a wildcard '*' is forbidden by the spec.
    origin: (origin, callback) => {
        // Allow server-to-server requests (e.g. Postman, curl) that have no Origin
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from disallowed origin: ${origin}`);
        return callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
    },
    credentials: true,   // Required for cookies / Authorization header
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // Explicitly permit headers the browser sends in preflight checks.
    // Without this, preflight for 'Authorization' or 'Content-Type' fails.
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS to every route
app.use(cors(corsOptions));

// Respond to ALL preflight OPTIONS requests immediately.
// This MUST come before any route definitions.
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

export default app;