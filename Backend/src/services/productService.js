const PRODUCTS_URL = (process.env.PRODUCTS_API_URL || "https://dummyjson.com/products").replace(/\/$/, "");

function normalizeProducts(responseBody) {
    const products = Array.isArray(responseBody) ? responseBody : responseBody?.products;
    if (!Array.isArray(products)) {
        throw new Error("Product catalogue returned an invalid response.");
    }

    return products.map((product) => {
        if (typeof product.image === "string") {
            return product;
        }

        return {
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description || "",
            category: product.category,
            image: product.thumbnail || product.images?.[0],
            rating: typeof product.rating === "number"
                ? { rate: product.rating, count: product.reviews?.length || 0 }
                : product.rating,
        };
    });
}

async function getProducts(category, fetchImpl = global.fetch) {
    const url = new URL(category
        ? `${PRODUCTS_URL}/category/${encodeURIComponent(category)}`
        : PRODUCTS_URL);
    url.searchParams.set("limit", "0");
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
        throw new Error(`Product catalogue returned HTTP ${response.status}.`);
    }

    return normalizeProducts(await response.json());
}

async function getCategories(fetchImpl = global.fetch) {
    const response = await fetchImpl(`${PRODUCTS_URL}/category-list`, {
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
