import express from 'express';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

const app = express();
const port = 8080;

const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carritos.json', './productos.json');

// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    response: err.response || 'Ocurrió un error inesperado'
  });
};

app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para manejar productos
app.get('/api/products', (req, res, next) => {
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
    next({ status: 400, response: error.message });
  }
});

app.get('/api/products/:pid', (req, res, next) => {
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
    next({ status: 400, response: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json({
      status: 'success',
      response: newProduct
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      response: error.message
    });
  }
});

app.put('/api/products/:pid', (req, res, next) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = productManager.updateProduct(productId, req.body);
    if (updatedProduct) {
      res.json({
        success: true,
        response: updatedProduct
      });
    } else {
      res.json({
        success: false,
        response: {}
      });
    }
  } catch (error) {
    next({ status: 400, response: error.message });
  }
});


// Rutas para manejar carritos
app.post('/api/carts', (req, res) => {
  try {
    const cart = cartManager.addCart(); 
    res.json({
      success: true,
      response: cart
    });
  } catch (error) {
    res.json({
      success: false,
      response: error.message
    });
  }
});

app.put('/api/carts/:cid/product/:pid/:units', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const units = parseInt(req.params.units);

  const result = cartManager.updateCart(cid, pid, units);

  if (result === 'Not found') {
    res.status(404).send('Carrito o producto no encontrado');
  } else if (result === 'updateCart: error') {
    res.status(400).send('Cantidad de unidades inválida');
  } else {
    res.send(result);
  }
});



app.delete('/api/carts/:cid/product/:pid/:units', (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const units = parseInt(req.params.units);

  const result = cartManager.deleteCart(cid, pid, units);

  if (result === 'Not found') {
    res.status(404).send('Carrito o producto no encontrado');
  } else if (result === 'deleteCart: error') {
    res.status(400).send('Cantidad de unidades inválida');
  } else {
    res.send(result);
  }
});

app.get('/api/carts', (req, res) => {
  const carts = cartManager.getCarts();
  if (carts === 'Not found') {
    res.status(404).send('No se encontraron carritos');
  } else if (carts === 'getCarts: error') {
    res.status(500).send('Error al leer el archivo de carritos');
  } else {
    res.send(carts);
  }
});

app.get('/api/carts/:cid', (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cid);
  if (cart === 'Not found') {
    res.status(404).send('Carrito no encontrado');
  } else {
    res.send(cart);
  }
});


app.listen(port, () => {
  console.log(`Servidor puerto: ${port}`);
});
