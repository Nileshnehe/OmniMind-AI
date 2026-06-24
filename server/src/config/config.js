import { config } from "dotenv";
config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not defined");
};



export const configData = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_USER: process.env.GOOGLE_USER,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API: process.env.GEMINI_API_KEY,
    MISTRAL_API: process.env.MISTRAL_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL
}