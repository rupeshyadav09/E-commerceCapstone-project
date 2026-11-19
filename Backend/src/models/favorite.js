const mongoose = require("mongoose");
const productSnapshotSchema = require("./productSnapshotSchema");

const favoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true, maxlength: 64 },
    productId: { type: String, required: true },
    product: { type: productSnapshotSchema, required: true },
}, { timestamps: true });

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
