const mongoose = require("mongoose");
const productSnapshotSchema = require("./productSnapshotSchema");

const cartItemSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true, maxlength: 64 },
    productId: { type: String, required: true },
    product: { type: productSnapshotSchema, required: true },
    quantity: { type: Number, required: true, min: 1, max: 99, default: 1 },
}, { timestamps: true });

cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
