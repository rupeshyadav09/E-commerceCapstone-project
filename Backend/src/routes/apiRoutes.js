const express = require("express");
const CartItem = require("../models/cartItem");
const Favorite = require("../models/favorite");
const createProductController = require("../controllers/productController");
const { createCollectionController } = require("../controllers/collectionController");

function createApiRoutes(options = {}) {
    const router = express.Router();
    const products = createProductController(options.fetchImpl);
    const collections = createCollectionController({
        CartItem: options.CartItem || CartItem,
        Favorite: options.Favorite || Favorite,
    });

    router.get("/products/categories", products.categories);
    router.get("/products", products.list);
    router.get("/products/:category", products.list);
    router.get("/cart", collections.listCart);
    router.post("/api/cart", collections.addCart);
    router.put("/api/cart/:productId", collections.updateCart);
    router.delete("/api/cart/:productId", collections.removeCart);
    router.get("/favorites", collections.listFavorites);
    router.post("/api/favorites", collections.addFavorite);
    router.delete("/api/favorites/:productId", collections.removeFavorite);

    return router;
}

module.exports = createApiRoutes;
