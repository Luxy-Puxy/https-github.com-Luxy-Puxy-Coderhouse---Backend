const fs = require('fs');

class CartManager {
  constructor(cartFile, productsFile) {
    this.cartFile = cartFile;
    this.productsFile = productsFile;
    this.carts = [];
    this.products = [];
    this.init();
  }

  init() {
    try {
      const cartData = fs.readFileSync(this.cartFile, 'utf-8');
      this.carts = JSON.parse(cartData);
      const productData = fs.readFileSync(this.productsFile, 'utf-8');
      this.products = JSON.parse(productData);
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
      const cartData = fs.readFileSync(this.cartFile, 'utf-8');
      const carts = JSON.parse(cartData);
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

  updateCart(cid, pid, units) {
    const cart = this.carts.find((c) => c.id === cid);
    const product = this.products.find((p) => p.id === pid);
    if (!cart) {
      console.log('Carrito no encontrado');
      return 'Not found';
    } else if (!product) {
      console.log('Producto no encontrado');
      return 'Not found';
    } else if (units <= 0) {
      console.log('Las unidades deben ser mayores a cero');
      return 'updateCart: error';
    } else if (units > product.stock) {
      console.log('La cantidad máxima a agregar es', product.stock);
      return 'updateCart: error';
    } else {
      const cartProduct = cart.products.find((p) => p.id === pid);
      if (!cartProduct) {
        cart.products.push({id: pid, units: units});
      } else {
        cartProduct.units += units;
      }
      product.stock -= units;
      try {
        fs.writeFileSync(this.cartFile, JSON.stringify(this.carts));
        fs.writeFileSync(this.productsFile, JSON.stringify(this.products));
        console.log('Producto agregado al carrito');
        return 'Producto agregado al carrito';
      } catch (error) {
        console.log('Error al actualizar carrito y/o producto', error);
        return 'updateCart: error';
      }
    }
  }
  
  deleteCart(cid, pid, units) {
    const cart = this.carts.find((c) => c.id === cid);
    const product = this.products.find((p) => p.id === pid);
    if (!cart) {
      console.log('Carrito no encontrado');
      return 'Not found';
    } else if (!product) {
      console.log('Producto no encontrado');
      return 'Not found';
    } else {
      const cartProduct = cart.products.find((p) => p.id === pid);
      if (!cartProduct) {
        console.log('Producto no encontrado en el carrito');
        return 'Not found';
      } else if (units > cartProduct.units) {
        console.log('La cantidad máxima a quitar es', cartProduct.units);
        return 'deleteCart: error';
      } else {
        cartProduct.units -= units;
        product.stock += units;
        if (cartProduct.units === 0) {
          cart.products = cart.products.filter((p) => p.id !== pid);
        }
        try {
          fs.writeFileSync(this.cartFile, JSON.stringify(this.carts));
          fs.writeFileSync(this.productsFile, JSON.stringify(this.products));
          console.log('Producto eliminado del carrito');
          return 'Producto eliminado del carrito';
        } catch (error) {
          console.log('Error al actualizar carrito y/o producto', error);
          return 'deleteCart: error';
        }
      }
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
