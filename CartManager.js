const fs = require('fs');

class CartManager {
  constructor(cartFile) {
    this.cartFile = cartFile;
    this.carts = [];
    this.init();
  }

  init() {
    try {
      const data = fs.readFileSync(this.cartFile, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.log('Error al leer el archivo', error);
    }
  }

  addCart() {
    const newCart = {
      id: this.carts.length + 1,
      products: []
    };

    try {
      this.carts.push(newCart);
      fs.writeFileSync(this.cartFile, JSON.stringify(this.carts));
      console.log('Carrito agregado');
      return newCart.id;
    } catch (error) {
      console.log('Error al agregar carrito', error);
      return 'addCart: error';
    }
  }

  getCarts() {
    try {
      const data = fs.readFileSync(this.cartFile, 'utf-8');
      const carts = JSON.parse(data);
      if (carts.length === 0) {
        return 'Not found';
      }
      return carts;
    } catch (error) {
      console.log('Error al leer el archivo', error);
      return 'getCarts: error';
    }
  }

  getCartById(id) {
    const cart = this.carts.find((c) => c.id === id);
    if (cart) {
      return cart;
    } else {
      console.log('Carrito no encontrado');
      return 'Not found';
    }
  }
}

module.exports = CartManager;


// const cartManager = new CartManager('./carritos.json');

// async function createNewCart() {
//   const newCartId = await cartManager.addCart();
//   console.log(`Nuevo carrito creado con ID: ${newCartId}`);
// }

// createNewCart(); // Output: Nuevo carrito creado con ID: 1



// const cartManager = new CartManager('./carritos.json');

// async function getCartByIdExample() {
//   const cartId = 1;
//   const cart = await cartManager.getCartById(cartId);
//   console.log(`El carrito con ID ${cartId} contiene: ${JSON.stringify(cart, null, 2)}`);
// }

// getCartByIdExample(); // Output: El carrito con ID 1 contiene: {"id":1,"productos":[]}


// const cartManager = new CartManager('./carritos.json');

// async function getAllCarts() {
//   const allCarts = await cartManager.getCarts();
//   console.log(`Todos los carritos almacenados: ${JSON.stringify(allCarts, null, 2)}`);
// }

// getAllCarts(); // Output: Todos los carritos almacenados: [{"id":1,"productos":[]}]


// const cartManager = new CartManager('./carritos.json');

// async function getLastCart() {
//   const lastCart = await cartManager.getCart();
//   console.log(`Último carrito agregado: ${JSON.stringify(lastCart, null, 2)}`);
// }

// getLastCart(); // Output: Último carrito agregado: {"id":1,"productos":[]}


// const cartManager = new CartManager('./carritos.json');
// const product = { id: 1, nombre: 'Zapatillas deportivas', precio: 2000 };

// async function addProductExample() {
//   const cartId = 1;
//   const success = await cartManager.addProduct(cartId, product);
//   if (success) {
//     console.log(`El producto ${product.nombre} se agregó al carrito con ID ${cartId}`);
//   } else {
//     console.log(`Error al agregar el producto al carrito`);
//   }
// }

// addProductExample(); // Output: El producto Zapatillas deportivas se agregó al carrito con ID 1
