// Importa los módulos necesarios y configura las dependencias
import { Router } from "express";
import { ProductManager } from "../data/managers/mongodb_managers/product.manager.js";
import { PORT } from "../config/server.config.js";

const productManager = new ProductManager();

export const productsViewController = Router();

productsViewController.get("/", async (req, res, next) => {
    const { page, search } = req.query;

    try {
        const response = await productManager.getProducts(6, page, null, search);

        const { prevPage, nextPage, hasPrevPage, hasNextPage } = response;
        const prevLink = hasPrevPage ? `http://localhost:${PORT}/products?page=${response.page - 1}` : null;
        const nextLink = hasNextPage ? `http://localhost:${PORT}/products?page=${response.page + 1}` : null;

        res.status(response.status).render("products.handlebars", {
            products: response.response,
            prevPage,
            nextPage,
            page: response.page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            style: "home.css",
            title: "Products",
            searchQuery: search
        });
    } catch (error) {
        next(error);
    }
});
