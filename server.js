const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carritos.json');

app.get('/api/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
    if (limit) {
      res.send(products.slice(0, limit));
    } else {
      res.send(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener los productos');
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send('Producto no encontrado :(');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el producto');
  }
});

app.post('/api/cart/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      const cartId = await cartManager.addCart();
      const success = await cartManager.addProduct(cartId, product);
      if (success) {
        res.send(await cartManager.getCartById(cartId));
      } else {
        res.status(500).send('Error al agregar el producto al carrito');
      }
    } else {
      res.status(404).send('Producto no encontrado :(');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

app.delete('/api/cart/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      const success = await cartManager.removeProduct(product);
      if (success) {
        res.send(await cartManager.getCart());
      } else {
        res.status(500).send('Error al eliminar el producto del carrito');
      }
    } else {
      res.status(404).send('Producto no encontrado :(');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al eliminar el producto del carrito');
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const cart = await cartManager.getCart();
    res.send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el carrito');
  }
});

app.listen(8080, () => {
  console.log('Servidor esta escuchando musica en puerto el 8080 :D');
});


