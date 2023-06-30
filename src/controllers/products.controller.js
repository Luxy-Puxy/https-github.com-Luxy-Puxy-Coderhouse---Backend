import { Router } from "express";
import { ProductManager } from "../data/managers/mongodb_managers/product.manager.js";
import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const productsController = Router();

const productManager = new ProductManager();

const productSchema = new Schema({
  title: { type: String, required: true, index: true },
});

productSchema.plugin(mongoosePaginate);

const Product = model("Product", productSchema);

productsController.get("/", async (req, res, next) => {
  const { page = 1 } = req.query;
  const limit = 6;

  try {
    const options = {
      page: parseInt(page, 10),
      limit: limit,
      sort: { _id: "asc" },
    };

    const result = await Product.paginate({}, options);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});



productsController.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await productManager.getProductById(id);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.post("/", async (req, res, next) => {
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status = true,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.createProduct(product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.updateProduct(id, product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.updateAllProductData(id, product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await productManager.deleteProduct(id);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.delete("/", async (req, res, next) => {
  try {
    const response = await productManager.deleteAllProducts();

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});


// Resto del código del controlador...

productsController.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await productManager.getProductById(id);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.post("/", async (req, res, next) => {
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status = true,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.createProduct(product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.updateProduct(id, product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  } = req.body;
  const product = {
    title,
    description,
    category,
    thumbnails,
    stock,
    price,
    code,
    status,
  };

  try {
    const response = await productManager.updateAllProductData(id, product);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await productManager.deleteProduct(id);

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

productsController.delete("/", async (req, res, next) => {
  try {
    const response = await productManager.deleteAllProducts();

    res.status(response.status).json(response);
  } catch (error) {
    next(error);
  }
});

