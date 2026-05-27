import { config } from "dotenv";
config();


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not define in environment variables");
}

export const configData = {
    MONGO_URI: process.env.MONGO_URI,
}