const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", maxlength: 5000 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    image: { type: String, required: true },
    rating: {
        rate: { type: Number, min: 0, max: 5, default: 0 },
        count: { type: Number, min: 0, default: 0 },
    },
}, { _id: false });
