import { configData } from "./src/config/config.js";
const PORT = configData.PORT || 3000;

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";


const httpServer = http.createServer(app);
initSocket(httpServer)

const startServer = async () => {
    try {
        await connectDB()

        httpServer.listen(PORT);

        httpServer.on("listening", () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });

        // Gracefully handle port-in-use instead of crashing
        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`❌ Port ${PORT} is already in use. Killing conflicting process and retrying...`);
                process.exit(1); // nodemon will restart it once port is free
            } else {
                console.error("Server error:", err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.log("Critical Startup Error:", error.message);
        process.exit(1);
    }
}

startServer();