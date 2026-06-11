import { configData } from "./config.js";
import mongoose from "mongoose";


const connectDB = async ()=> {
try {
    await mongoose.connect(configData.MONGO_URI);
    console.log("Mongoose connected Successfully")
} catch (error) {
    console.error("MongoDb Connection failed:", error.message);
    throw error
}
}


export default connectDB