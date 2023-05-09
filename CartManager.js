const fs = require('fs');

class CartManager {
  constructor(cartsFile) {
    this.cartsFile = cartsFile;
    if (!fs.existsSync(cartsFile)) {
      fs.writeFileSync(cartsFile, JSON.stringify([]));
    }
  }

  async getCarts() {
    const carts = await this.readCartsFile();
    return carts;
  }

  async getCartById(cartId) {
    const carts = await this.readCartsFile();
    const cart = carts.find((cart) => cart.id === cartId);
    return cart;
  }

  async addCart() {
    const carts = await this.readCartsFile();
    const newCart = {
      id: Date.now(),
      products: [],
    };
    carts.push(newCart);
    const success = await this.writeCartsFile(carts);
    if (success) {
      console.log('Nuevo carrito creado con ID:', newCart.id);
      return newCart.id;
    } else {
      console.log('addCart: error');
      return null;
    }
  }

  async addProduct(cartId, product) {
    const carts = await this.readCartsFile();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex === -1) {
      return false;
    }
    carts[cartIndex].products.push(product);
    const success = await this.writeCartsFile(carts);
    return success;
  }

  async removeProduct(product) {
    const carts = await this.readCartsFile();
    let success = false;
    carts.forEach((cart) => {
      const productIndex = cart.products.findIndex(
        (p) => p.id === product.id
      );
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
        success = true;
      }
    });
    await this.writeCartsFile(carts);
    return success;
  }

  async getCart() {
    const carts = await this.readCartsFile();
    if (carts.length > 0) {
      return carts[0];
    } else {
      return null;
    }
  }

  async readCartsFile() {
    const cartsData = await fs.promises.readFile(this.cartsFile);
    const carts = JSON.parse(cartsData);
    return carts;
  }

  async writeCartsFile(carts) {
    try {
      await fs.promises.writeFile(this.cartsFile, JSON.stringify(carts));
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
