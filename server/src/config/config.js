import { config } from "dotenv";
config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not defined");
};



export const configData = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_USER: process.env.GOOGLE_USER,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API: process.env.GEMINI_API_KEY,
    MISTRAL_API: process.env.MISTRAL_API_KEY
}