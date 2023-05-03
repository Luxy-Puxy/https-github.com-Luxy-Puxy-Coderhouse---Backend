const express = require('express');
const app = express();
const ProductManager = require('./ProductManager');
const productManager = new ProductManager('./productos.json');


app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
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

app.listen(8080, () => {
  console.log('Servidor esta escuchando musica en puerto el 8080 :D');
});
