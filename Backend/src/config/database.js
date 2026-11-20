
const mongoose = require("mongoose");

let connectionPromise;

async function connectDatabase() {
    const { MONGODB_URI } = process.env;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI must be set before starting the API.");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (mongoose.connection.readyState === 2 && connectionPromise) {
        return connectionPromise;
    }

    connectionPromise = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
    }).then(() => {
        console.info("Connected to MongoDB.");
    }).catch((error) => {
        connectionPromise = undefined;
        throw error;
    });

    return connectionPromise;
}

module.exports = connectDatabase;
