const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const createApp = require("../app");

function createMemoryModel() {
    return class MemoryModel {
        static records = [];
        static nextId = 1;

        static find({ userId }) {
            return Promise.resolve(this.records
                .filter((record) => record.userId === userId)
                .map((record) => ({ ...record })));
        }

        static async findOneAndUpdate(filter, update, options = {}) {
            let record = this.records.find((entry) => (
                entry.userId === filter.userId
                && entry.productId === filter.productId
                && (filter.quantity === undefined || entry.quantity <= filter.quantity.$lte)
            ));

            if (!record && options.upsert) {
                if (this.records.some((entry) => (
                    entry.userId === filter.userId && entry.productId === filter.productId
                ))) {
                    const error = new Error("Duplicate key.");
                    error.code = 11000;
                    throw error;
                }
                record = {
                    _id: String(this.nextId++),
                    userId: filter.userId,
                    productId: filter.productId,
                    quantity: 0,
                };
                this.records.push(record);
            }
            if (!record) return null;

            if (update.$set) Object.assign(record, update.$set);
            if (update.$inc) {
                for (const [key, increment] of Object.entries(update.$inc)) {
                    record[key] = (record[key] || 0) + increment;
                }
            }
            if (update.$setOnInsert && record.quantity === 0) {
                Object.assign(record, update.$setOnInsert);
            }
            return { ...record };
        }

        static async findOneAndDelete(filter) {
            const index = this.records.findIndex((entry) => (
                entry.userId === filter.userId && entry.productId === filter.productId
            ));
            if (index < 0) return null;
            return this.records.splice(index, 1)[0];
        }
    };
}

const CartItem = createMemoryModel();
const Favorite = createMemoryModel();
const product = {
    id: 21,
    title: "Test product",
    price: 12.5,
    description: "Test description",
    category: "electronics",
    image: "https://example.com/product.png",
    rating: { rate: 4.5, count: 10 },
};

let server;
let baseUrl;
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

before(async () => {
    console.info = () => {};
    console.error = () => {};
    const app = createApp({
        CartItem,
        Favorite,
        fetchImpl: async (url) => ({
            ok: true,
            json: async () => (url.endsWith("/categories")
                ? ["electronics"]
                : [{ ...product, id: 21 }]),
        }),
    });
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    console.info = originalConsoleInfo;
    console.error = originalConsoleError;
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

test("catalogue endpoints return product and category arrays", async () => {
    const productsResponse = await fetch(`${baseUrl}/products/electronics`);
    assert.equal(productsResponse.status, 200);
    assert.equal((await productsResponse.json())[0].id, 21);

    const categoriesResponse = await fetch(`${baseUrl}/products/categories`);
    assert.deepEqual(await categoriesResponse.json(), ["electronics"]);
});

test("cart persists products per user, increments quantity, and supports removal", async () => {
    const first = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "test-user" },
        body: JSON.stringify({ product }),
    });
    assert.equal(first.status, 201);
    assert.equal((await first.json()).item.quantity, 1);

    await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "test-user" },
        body: JSON.stringify({ product, quantity: 2 }),
    });

    const listResponse = await fetch(`${baseUrl}/cart`, {
        headers: { "x-user-id": "test-user" },
    });
    const items = await listResponse.json();
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 3);
    assert.deepEqual(await (await fetch(`${baseUrl}/cart`)).json(), []);

    const updateResponse = await fetch(`${baseUrl}/api/cart/21`, {
        method: "PUT",
        headers: { "content-type": "application/json", "x-user-id": "test-user" },
        body: JSON.stringify({ quantity: 4 }),
    });
    assert.equal(updateResponse.status, 200);
    const updatedItems = await (await fetch(`${baseUrl}/cart`, {
        headers: { "x-user-id": "test-user" },
    })).json();
    assert.equal(updatedItems[0].quantity, 4);

    const removeResponse = await fetch(`${baseUrl}/api/cart/21`, {
        method: "DELETE",
        headers: { "x-user-id": "test-user" },
    });
    assert.equal(removeResponse.status, 200);

    const cappedProduct = { ...product, id: 22 };
    const cappedResponse = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "test-user" },
        body: JSON.stringify({ product: cappedProduct, quantity: 99 }),
    });
    assert.equal(cappedResponse.status, 201);
    const overLimitResponse = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": "test-user" },
        body: JSON.stringify({ product: cappedProduct }),
    });
    assert.equal(overLimitResponse.status, 409);
});

test("favorites are stored and invalid products receive a useful 400", async () => {
    const favoriteResponse = await fetch(`${baseUrl}/api/favorites`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product }),
    });
    assert.equal(favoriteResponse.status, 201);

    await fetch(`${baseUrl}/api/favorites`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product }),
    });
    const favorites = await fetch(`${baseUrl}/favorites`);
    assert.equal((await favorites.json()).length, 1);

    const invalidResponse = await fetch(`${baseUrl}/api/cart`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product: { ...product, price: -1 } }),
    });
    assert.equal(invalidResponse.status, 400);
    assert.match((await invalidResponse.json()).message, /price/i);

    const invalidRating = await fetch(`${baseUrl}/api/favorites`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ product: { ...product, rating: null } }),
    });
    assert.equal(invalidRating.status, 400);

    const removeResponse = await fetch(`${baseUrl}/api/favorites/21`, { method: "DELETE" });
    assert.equal(removeResponse.status, 200);
});

test("OpenAPI schema and Swagger UI are available", async () => {
    const spec = await fetch(`${baseUrl}/openapi.json`);
    assert.equal(spec.status, 200);
    const document = await spec.json();
    assert.ok(document.paths["/api/cart"]);
    assert.ok(document.paths["/api/favorites"]);

    const swagger = await fetch(`${baseUrl}/api-docs/`);
    assert.equal(swagger.status, 200);
});

test("Vercel entrypoint exports the complete API without starting a local listener", async () => {
    const app = require("../index");
    const vercelServer = app.listen(0);
    await new Promise((resolve) => vercelServer.once("listening", resolve));
    const vercelUrl = `http://127.0.0.1:${vercelServer.address().port}`;

    try {
        const healthResponse = await fetch(`${vercelUrl}/`);
        assert.equal(healthResponse.status, 200);
        assert.equal((await healthResponse.json()).message, "ShopHub API is running.");

        const specResponse = await fetch(`${vercelUrl}/openapi.json`);
        assert.equal(specResponse.status, 200);
        assert.ok((await specResponse.json()).paths["/products"]);
    } finally {
        await new Promise((resolve, reject) => {
            vercelServer.close((error) => error ? reject(error) : resolve());
        });
    }
});

test("database connection is awaited only for cart and favorite routes", async () => {
    let connectionCount = 0;
    const app = createApp({
        CartItem,
        Favorite,
        connectDatabase: async () => {
            connectionCount += 1;
        },
    });
    const databaseServer = app.listen(0);
    await new Promise((resolve) => databaseServer.once("listening", resolve));
    const databaseUrl = `http://127.0.0.1:${databaseServer.address().port}`;

    try {
        await fetch(`${databaseUrl}/`);
        assert.equal(connectionCount, 0);

        const cartResponse = await fetch(`${databaseUrl}/cart`);
        assert.equal(cartResponse.status, 200);
        assert.equal(connectionCount, 1);
    } finally {
        await new Promise((resolve, reject) => {
            databaseServer.close((error) => error ? reject(error) : resolve());
        });
    }
});
