import { configData } from "./config/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan"
import authRouter from "./routes/auth.route.js"
import chatRouter from "./routes/chat.route.js";

const app = express();

app.use(cors({
    origin: configData.FRONTEND_URL ? [configData.FRONTEND_URL, "http://localhost:5173"] : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))

app.get("/", (req, res) => {
    res.json({ message: "ok" })
})

app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

export default app