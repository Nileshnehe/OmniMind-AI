import mongoose from "mongoose";
import { configData } from "./config.js";


const connectDB = async () => {
    try {
        await mongoose.connect(configData.MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connected failed:", error.message);
        throw error
    }
}

export default connectDB;