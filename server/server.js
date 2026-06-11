import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js";
import connectDB from "./src/config/db.js";


const PORT = process.env.PORT

console.log("USER:", process.env.GOOGLE_USER);
const startServer = async () => {
    try {
        
        await connectDB()

        app.listen(3000, () => {
    console.log(`server is running on port 3000`)
});
    } catch (error) {
        console.log("Critical Startup Error:", error.message);
        process.exit(1);
    }
}
startServer();