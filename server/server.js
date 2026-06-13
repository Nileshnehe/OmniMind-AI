import { configData } from "./src/config/config.js";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = configData.PORT

// testAi()
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