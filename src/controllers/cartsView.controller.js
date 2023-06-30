import { Router } from "express";
import { CartManager } from "../data/managers/mongodb_managers/cart.manager.js";

const cartManager = new CartManager();

export const cartsViewController = Router();

cartsViewController.get("/", async (req, res, next) => {
    const { page, search } = req.query;

    try {
        const response = await cartManager.getCarts();

        console.log(response);
        console.log("--------------------------------------------------------");
        console.log(JSON.stringify(response, null, 2));



        res.status(response.status).render("cart.handlebars", {
            style: "home.css",
            title: "Carts",
            searchQuery: search,
            carts: response.response
        });
    } catch (error) {
        next(error);
    }
});


cartsViewController.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await cartManager.getCartById(id);

    res.status(response.status).render("cart.handlebars", {
      id: response.response[0].id,
      products: response.response[0].products,
      style: "carts.css",
      title: "Carts",
    });
  } catch (error) {
    next(error);
  }
});
