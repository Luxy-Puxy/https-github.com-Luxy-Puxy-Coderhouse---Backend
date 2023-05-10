const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');


const app = express();
const port = 8080;

const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carritos.json');

app.get('/api/products', (req, res) => {
  try {
    const products = productManager.getProducts();
    const limit = req.query.limit;
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.json({
        success: true,
        response: limitedProducts
      });
    } else {
      res.json({
        success: true,
        response: products
      });
    }
  } catch (error) {
    res.json({
      success: false,
      response: error.message
    });
  }
});

app.get('/api/products/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    if (product) {
      res.json({
        success: true,
        response: product
      });
    } else {
      res.json({
        success: false,
        response: {}
      });
    }
  } catch (error) {
    res.json({
      success: false,
      response: error.message
    });
  }
});

app.get('/api/carts', (req, res) => {
  try {
    const carts = cartManager.getCarts();
    res.json({
      success: true,
      response: carts
    });
  } catch (error) {
    res.json({
      success: false,
      response: error.message
    });
  }
});

app.get('/api/carts/:cid', (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
      res.json({
        success: true,
        response: cart
      });
    } else {
      res.json({
        success: false,
        response: {}
      });
    }
  } catch (error) {
    res.json({
      success: false,
      response: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor puerto: ${port}`);
});
