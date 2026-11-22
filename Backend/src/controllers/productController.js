const productService = require("../services/productService");

function createProductController(fetchImpl) {
    return {
        async list(req, res, next) {
            try {
                const products = await productService.getProducts(req.params.category, fetchImpl);
                return res.json(products);
            } catch (error) {
                error.status = 502;
                return next(error);
            }
        },

        async categories(req, res, next) {
            try {
                return res.json(await productService.getCategories(fetchImpl));
            } catch (error) {
                error.status = 502;
                return next(error);
            }
        },
    };
}

module.exports = createProductController;
