// imports
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import fetch from 'node-fetch';

const app = express();
const port = 8070;
const server = http.createServer(app);
const io = new Server(server);
const handlebars = exphbs.create();
const productManager = new ProductManager('./productos.json');
const cartManager = new CartManager('./carritos.json', './productos.json');

//  ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//  Handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, './views'));

// Middleware 
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    response: err.response || 'Ocurrió un error inesperado'
  });
};

app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // Vista Home
  res.render('home');
});

app.get('/new_product', (req, res) => {
  // Vista new Product
  res.render('new_product');
});

app.get('/chatbot', (req, res) => {
  // Vista Chatbot
  res.render('chatbot');
});

//Vista Products
app.get('/products', async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const response = await fetch(`http://localhost:${port}/api/products?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (data.success) {
      const products = data.response;
      res.render('products', {
        products: products,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: products.length === limit ? parseInt(page) + 1 : null
      });
    } else {
      next({ status: 404, response: 'No se encontraron productos' });
    }
  } catch (error) {
    next({ status: 500, response: 'Error al obtener los productos' });
  }
});

//Vista Product Especifico
app.get('/products/:pid', async (req, res, next) => {
  try {
    const productId = parseInt(req.params.pid);

    const response = await fetch(`http://localhost:${port}/api/products/${productId}`);
    const data = await response.json();

    if (data.success) {
      const product = data.response;

      res.render('product_detail', { product });
    } else {
      next({ status: 404, response: 'Producto no encontrado' });
    }
  } catch (error) {
    next({ status: 500, response: 'Error al obtener el producto' });
  }
});



// Vista Carrito
app.get('/carts', async (req, res, next) => {
  try {
    // Obtener datos del carrito desde la API
    const response = await fetch(`http://localhost:${port}/api/carts/1`);
    const data = await response.json();

    if (data.success) {
      const cart = data.response;
      res.render('carts', { cart: cart });
    } else {
      next({ status: 404, response: 'Carrito no encontrado' });
    }
  } catch (error) {
    next({ status: 500, response: 'Error al obtener el carrito' });
  }
});




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
      success: true,
      response: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
        success: true
        ,
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
        
  app.get('/carts', async (req, res, next) => {
          try {
            const response = await fetch(`http://localhost:${port}/api/carts/1`);
            const data = await response.json();
            if (data.success) {
              const cart = data.response;
        
              res.render('cart', { cart }); 
            } else {
              next({ status: 404, response: 'Carrito no encontrado' });
            }
          } catch (error) {
            next({ status: 500, response: 'Error al obtener el carrito' });
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
        
        io.on('connection', (socket) => {
      
        });
        
        server.listen(port, () => {
          console.log(`Servidor puerto: ${port}`);
        });