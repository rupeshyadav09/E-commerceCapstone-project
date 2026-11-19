const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const apiRoutes = require("./src/routes/apiRoutes");
const openApiDocument = require("./src/docs/openapi");
const requestLogger = require("./src/middleware/requestLogger");
const errorHandler = require("./src/middleware/errorHandler");

function createApp(options = {}) {
    const app = express();
    const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    app.use(cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            const error = new Error("Origin is not allowed by CORS");
            error.status = 403;
            return callback(error);
        },
    }));
    app.use(express.json({ limit: "100kb" }));
    app.use(requestLogger);

    app.get("/", (req, res) => {
        res.status(200).json({ success: true, message: "ShopHub API is running." });
    });
    app.get("/openapi.json", (req, res) => res.json(openApiDocument));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
    app.use("/", apiRoutes(options));

    app.use((req, res) => {
        res.status(404).json({ success: false, message: "Route not found." });
    });
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
