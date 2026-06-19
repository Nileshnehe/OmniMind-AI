import { configData } from "./src/config/config.js";
const PORT = configData.PORT

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";


const httpServer = http.createServer(app);
initSocket(httpServer)
const startServer = async () => {
    try {
        
        await connectDB()

        httpServer.listen(3000, () => {
    console.log(`server is running on port 3000`)
});
    } catch (error) {
        console.log("Critical Startup Error:", error.message);
        process.exit(1);
    }
}
startServer();