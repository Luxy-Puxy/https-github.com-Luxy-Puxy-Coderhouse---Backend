const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.init();
  }

  init() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.log('Error al leer el archivo', error);
    }
  }

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    const existingProduct = this.products.find(p => p.code === code);
    if (existingProduct) {
      console.log('El código del producto ya está en uso');
      return;
    }

    if (!Object.values(newProduct).includes(undefined)) {
      this.products.push(newProduct);
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log('Producto agregado');
    } else {
      console.log("Todos los campos son obligatorios");
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Error al leer el archivo', error);
    }
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log('Producto no encontrado');
    }
  }

  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...updatedProduct,
        id: id,
      };
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log('Producto actualizado');
    } else {
      console.log('Producto no encontrado');
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      console.log('Producto eliminado');
    } else {
      console.log('Producto no encontrado');
    }
  }
}

module.exports = ProductManager;





// //***Testing***
// const productos = new ProductManager('productos.json');

// // getProducts
// console.log(productos.getProducts()); // []

// // addProduct
// productos.addProduct({
//   title: 'producto prueba',
//   description: 'Este es un producto prueba',
//   price: 200,
//   thumbnail: 'Sin imagen',
//   code: 'abc123',
//   stock: 25
// });

// console.log(productos.getProducts()); 

// // getProductById
// console.log(productos.getProductById(1));
// console.log(productos.getProductById(2)); // "Producto no encontrado"

// //updateProduct
// productos.updateProduct(1, { title: 'producto actualizado', description: 'Este es un producto actualizado', price: 300, thumbnail: 'Sin imagen', code: 'def456', stock: 10, id: 1 });
// console.log(productos.getProducts()); 

// // deleteProduct
// productos.deleteProduct(1);
// console.log(productos.getProducts()); // []
// console.log(productos.getProductById(1)); // "Producto no encontrado"
// productos.deleteProduct(1); // "Producto no encontrado"
