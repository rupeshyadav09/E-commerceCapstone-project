
const mongoose = require("mongoose");

async function connectDatabase() {
    const { MONGODB_URI } = process.env;

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI must be set before starting the API.");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
    });

    console.info("Connected to MongoDB.");
}

module.exports = connectDatabase;
