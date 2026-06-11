import { config } from "dotenv";
config();

if (!process.env.MONGO_URI) {
    throw new Error("Mongo URI not defined");
};



export const configData = {
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_USER: process.env.GOOGLE_USER,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
}