require("dotenv").config();

const mongoose = require("mongoose");
const createApp = require("./app");
const connectDatabase = require("./src/config/database");

const port = Number(process.env.PORT) || 8080;
const app = createApp({ connectDatabase });

async function startServer() {
    await connectDatabase();

    const server = app.listen(port, () => {
        console.info(`ShopHub API listening on port ${port}`);
    });

    const shutdown = async (signal) => {
        console.info(`${signal} received; closing ShopHub API.`);
        server.close(async (error) => {
            if (error) {
                console.error("Failed to close the HTTP server cleanly.", error);
                process.exitCode = 1;
            }
            await mongoose.disconnect();
        });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("ShopHub API failed to start.", error);
        process.exitCode = 1;
    });
}

module.exports = app;
