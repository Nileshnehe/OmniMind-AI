import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import morgan from "morgan"
import authRouter from "./routes/auth.route.js"


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
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


export default app