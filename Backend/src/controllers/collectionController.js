const productIdPattern = /^[a-zA-Z0-9._:-]{1,100}$/;
const userIdPattern = /^[a-zA-Z0-9._:-]{1,64}$/;

function validationError(message) {
    const error = new Error(message);
    error.status = 400;
    return error;
}

function normalizeProduct(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw validationError("A product object is required.");
    }
    const { id, title, price, description = "", category, image } = input;
    const rating = input.rating === undefined ? {} : input.rating;
    if (!rating || typeof rating !== "object" || Array.isArray(rating)) {
        throw validationError("Product rating must be an object.");
    }
    if (typeof id !== "string" && typeof id !== "number") {
        throw validationError("Product id must be a string or integer.");
    }
    if (typeof id === "number" && (!Number.isSafeInteger(id) || id < 0)) {
        throw validationError("Numeric product ids must be non-negative safe integers.");
    }
    const productId = String(id ?? "");
    if (!productIdPattern.test(productId)) {
        throw validationError("Product id must be a non-empty identifier of at most 100 characters.");
    }
    if (typeof title !== "string" || !title.trim() || title.trim().length > 200) {
        throw validationError("Product title is required and must be at most 200 characters.");
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        throw validationError("Product price must be a non-negative number.");
    }
    if (typeof category !== "string" || !category.trim() || category.trim().length > 100) {
        throw validationError("Product category is required and must be at most 100 characters.");
    }
    if (typeof image !== "string" || image.length > 2048) {
        throw validationError("Product image must be a valid URL.");
    }
    let imageUrl;
    try {
        imageUrl = new URL(image);
    } catch {
        throw validationError("Product image must be a valid URL.");
    }
    if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw validationError("Product image must use HTTP or HTTPS.");
    }
    if (typeof description !== "string" || description.length > 5000) {
        throw validationError("Product description must be at most 5000 characters.");
    }
    const rate = rating.rate === undefined ? 0 : rating.rate;
    const count = rating.count === undefined ? 0 : rating.count;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate < 0 || rate > 5
        || !Number.isInteger(count) || count < 0) {
        throw validationError("Product rating must have a rate from 0 to 5 and a non-negative count.");
    }

    return {
        id: productId,
        title: title.trim(),
        price,
        description,
        category: category.trim(),
        image: imageUrl.toString(),
        rating: { rate, count },
    };
}

function getUserId(req) {
    const userId = req.get("X-User-Id") || "guest";
    if (!userIdPattern.test(userId)) {
        throw validationError("X-User-Id must be 1-64 letters, numbers, dots, underscores, colons, or hyphens.");
    }
    return userId;
}

function findMany(Model, filter) {
    const query = Model.find(filter);
    return typeof query.lean === "function" ? query.lean() : query;
}

function createCollectionController({ CartItem, Favorite }) {
    return {
        async listCart(req, res, next) {
            try {
                const items = await findMany(CartItem, { userId: getUserId(req) });
                return res.json(items.map((item) => ({
                    ...item.product,
                    quantity: item.quantity,
                    cartItemId: item._id,
                })));
            } catch (error) {
                return next(error);
            }
        },

        async addCart(req, res, next) {
            try {
                const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
                    ? req.body
                    : {};
                const product = normalizeProduct(body.product || body);
                const quantity = body.quantity === undefined ? 1 : body.quantity;
                if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
                    throw validationError("Quantity must be an integer from 1 to 99.");
                }
                const filter = {
                    userId: getUserId(req),
                    productId: product.id,
                    quantity: { $lte: 99 - quantity },
                };
                const update = { $set: { product }, $inc: { quantity } };
                let item;
                try {
                    item = await CartItem.findOneAndUpdate(
                        filter,
                        update,
                        { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
                    );
                } catch (error) {
                    if (error.code !== 11000) throw error;
                    item = await CartItem.findOneAndUpdate(
                        filter,
                        update,
                        { returnDocument: "after", runValidators: true },
                    );
                    if (!item) {
                        const limitError = new Error("Cart quantity cannot exceed 99.");
                        limitError.status = 409;
                        throw limitError;
                    }
                }
                const productData = item.product.toObject ? item.product.toObject() : item.product;
                return res.status(201).json({
                    success: true,
                    message: "Product added to cart.",
                    item: { ...productData, quantity: item.quantity },
                });
            } catch (error) {
                return next(error);
            }
        },

        async updateCart(req, res, next) {
            try {
                const productId = req.params.productId;
                if (!productIdPattern.test(productId)) {
                    throw validationError("Product id is invalid.");
                }
                const quantity = req.body.quantity;
                if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
                    throw validationError("Quantity must be an integer from 1 to 99.");
                }
                const item = await CartItem.findOneAndUpdate(
                    { userId: getUserId(req), productId },
                    { $set: { quantity } },
                    { returnDocument: "after", runValidators: true },
                );
                if (!item) {
                    return res.status(404).json({ success: false, message: "Cart item not found." });
                }
                return res.json({ success: true, item });
            } catch (error) {
                return next(error);
            }
        },

        async removeCart(req, res, next) {
            try {
                if (!productIdPattern.test(req.params.productId)) {
                    throw validationError("Product id is invalid.");
                }
                const item = await CartItem.findOneAndDelete({
                    userId: getUserId(req),
                    productId: req.params.productId,
                });
                if (!item) {
                    return res.status(404).json({ success: false, message: "Cart item not found." });
                }
                return res.json({ success: true, message: "Product removed from cart." });
            } catch (error) {
                return next(error);
            }
        },

        async listFavorites(req, res, next) {
            try {
                const items = await findMany(Favorite, { userId: getUserId(req) });
                return res.json(items.map((item) => item.product));
            } catch (error) {
                return next(error);
            }
        },

        async addFavorite(req, res, next) {
            try {
                const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
                    ? req.body
                    : {};
                const product = normalizeProduct(body.product || body);
                const favorite = await Favorite.findOneAndUpdate(
                    { userId: getUserId(req), productId: product.id },
                    { $setOnInsert: { product } },
                    { upsert: true, returnDocument: "after", runValidators: true, setDefaultsOnInsert: true },
                );
                const productData = favorite.product.toObject ? favorite.product.toObject() : favorite.product;
                return res.status(201).json({
                    success: true,
                    message: "Product added to favorites.",
                    product: productData,
                });
            } catch (error) {
                return next(error);
            }
        },

        async removeFavorite(req, res, next) {
            try {
                if (!productIdPattern.test(req.params.productId)) {
                    throw validationError("Product id is invalid.");
                }
                const favorite = await Favorite.findOneAndDelete({
                    userId: getUserId(req),
                    productId: req.params.productId,
                });
                if (!favorite) {
                    return res.status(404).json({ success: false, message: "Favorite not found." });
                }
                return res.json({ success: true, message: "Product removed from favorites." });
            } catch (error) {
                return next(error);
            }
        },
    };
}

module.exports = { createCollectionController, normalizeProduct };
