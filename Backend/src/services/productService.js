const PRODUCTS_URL = process.env.PRODUCTS_API_URL || "https://fakestoreapi.com/products";

async function getProducts(category, fetchImpl = global.fetch) {
    const url = category
        ? `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`
        : PRODUCTS_URL;
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        throw new Error(`Product catalogue returned HTTP ${response.status}.`);
    }

    const products = await response.json();
    if (!Array.isArray(products)) {
        throw new Error("Product catalogue returned an invalid response.");
    }
    return products;
}

async function getCategories(fetchImpl = global.fetch) {
    const response = await fetchImpl(`${PRODUCTS_URL}/categories`, {
        signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
        throw new Error(`Product catalogue returned HTTP ${response.status}.`);
    }
    const categories = await response.json();
    if (!Array.isArray(categories) || categories.some((category) => typeof category !== "string")) {
        throw new Error("Product catalogue returned an invalid category list.");
    }
    return categories;
}

module.exports = { getProducts, getCategories };
