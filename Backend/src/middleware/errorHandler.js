function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const status = error.status
        || (error.name === "ValidationError" ? 400 : undefined)
        || (error.code === 11000 ? 409 : 500);
    const message = status >= 500
        ? "An unexpected server error occurred."
        : error.code === 11000
            ? "A record with these values already exists."
            : error.message;
    console.error(`${req.method} ${req.originalUrl} failed with status ${status}.`, error);

    return res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
