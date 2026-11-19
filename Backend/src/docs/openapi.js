module.exports = {
    openapi: "3.0.3",
    info: {
        title: "ShopHub E-commerce API",
        version: "1.0.0",
        description: "Product catalogue, shopping cart, and favorites API.",
    },
    servers: [{ url: "/" }],
    tags: [
        { name: "Products" },
        { name: "Cart" },
        { name: "Favorites" },
    ],
    components: {
        parameters: {
            UserId: {
                name: "X-User-Id",
                in: "header",
                required: false,
                description: "Optional guest/session partition key; this is not authentication.",
                schema: { type: "string", maxLength: 64 },
            },
        },
        schemas: {
            Product: {
                type: "object",
                required: ["id", "title", "price", "category", "image"],
                properties: {
                    id: { oneOf: [{ type: "integer" }, { type: "string" }] },
                    title: { type: "string", maxLength: 200 },
                    price: { type: "number", minimum: 0 },
                    description: { type: "string", maxLength: 5000 },
                    category: { type: "string", maxLength: 100 },
                    image: { type: "string", format: "uri" },
                    rating: {
                        type: "object",
                        properties: {
                            rate: { type: "number", minimum: 0, maximum: 5 },
                            count: { type: "integer", minimum: 0 },
                        },
                    },
                },
            },
            Error: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string" },
                },
            },
        },
    },
    paths: {
        "/products": {
            get: {
                tags: ["Products"],
                summary: "List all products",
                responses: {
                    200: { description: "Array of catalogue products." },
                    502: { description: "Catalogue provider is unavailable." },
                },
            },
        },
        "/products/{category}": {
            get: {
                tags: ["Products"],
                summary: "List products in a category",
                parameters: [{ name: "category", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Array of products in the category." } },
            },
        },
        "/products/categories": {
            get: {
                tags: ["Products"],
                summary: "List product categories",
                responses: { 200: { description: "Array of category names." } },
            },
        },
        "/cart": {
            get: {
                tags: ["Cart"],
                summary: "Get the current guest/session cart",
                parameters: [{ $ref: "#/components/parameters/UserId" }],
                responses: { 200: { description: "Array of cart products with quantity." } },
            },
        },
        "/api/cart": {
            post: {
                tags: ["Cart"],
                summary: "Add a product to the cart",
                parameters: [{ $ref: "#/components/parameters/UserId" }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    product: { $ref: "#/components/schemas/Product" },
                                    quantity: { type: "integer", minimum: 1, maximum: 99, default: 1 },
                                },
                                required: ["product"],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Cart item created or quantity increased." },
                    400: { description: "Invalid product or quantity.", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
                    409: { description: "Cart quantity limit reached." },
                },
            },
        },
        "/api/cart/{productId}": {
            put: {
                tags: ["Cart"],
                summary: "Set a cart product quantity",
                parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }, { $ref: "#/components/parameters/UserId" }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object", required: ["quantity"], properties: { quantity: { type: "integer", minimum: 1, maximum: 99 } } } } },
                },
                responses: { 200: { description: "Updated cart item." }, 404: { description: "Cart item not found." } },
            },
            delete: {
                tags: ["Cart"],
                summary: "Remove a product from the cart",
                parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }, { $ref: "#/components/parameters/UserId" }],
                responses: { 200: { description: "Cart item removed." }, 404: { description: "Cart item not found." } },
            },
        },
        "/favorites": {
            get: {
                tags: ["Favorites"],
                summary: "List favorites",
                parameters: [{ $ref: "#/components/parameters/UserId" }],
                responses: { 200: { description: "Array of favorite products." } },
            },
        },
        "/api/favorites": {
            post: {
                tags: ["Favorites"],
                summary: "Add a product to favorites",
                parameters: [{ $ref: "#/components/parameters/UserId" }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object", properties: { product: { $ref: "#/components/schemas/Product" } }, required: ["product"] } } },
                },
                responses: { 201: { description: "Favorite created or already present." }, 400: { description: "Invalid product." } },
            },
        },
        "/api/favorites/{productId}": {
            delete: {
                tags: ["Favorites"],
                summary: "Remove a product from favorites",
                parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }, { $ref: "#/components/parameters/UserId" }],
                responses: { 200: { description: "Favorite removed." }, 404: { description: "Favorite not found." } },
            },
        },
    },
};
