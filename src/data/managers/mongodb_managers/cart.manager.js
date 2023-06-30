import { cartModel } from "../../models/carts.model.js";
import { productModel } from "../../models/products.model.js";
import { CustomError } from "../../../utils/CustomError.js";

export class CartManager {
  async getCarts() {
    try {
      const response = await cartModel.find().populate("products.product");

      if (!response.length) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "No carts.",
        });
      }

      const mapped = response.map((cart) => ({
        id: cart._id,
        products: cart.products
          ? cart.products
              .sort((a, b) =>
                a.product.title.localeCompare(b.product.title, "en", {
                  sensitivity: "base",
                })
              )
              .map(({ product }) => ({
                id: product._id,
                title: product.title,
                description: product.description,
                category: product.category,
                thumbnails: product.thumbnails,
                stock: product.stock,
                price: product.price,
                code: product.code,
                status: product.status,
              }))
          : [],
        total: cart.products.reduce((acc, { product }) => acc + product.price, 0),
      }));

      return { status: 200, ok: true, response: mapped };
    } catch (error) {
      throw new CustomError(error);
    }
  }
  async getCartById(id) {
    try {
      const cartFound = await cartModel.findById(id);

      if (!cartFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found",
        });
      }

      const mapped = { id: cartFound._id, products: cartFound.products };

      return { status: 200, ok: true, response: mapped };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async createCart() {
    try {
      const response = await cartModel.create({ products: [] });

      return { status: 201, ok: true, response: "Cart created." };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cartFound = await cartModel.findById(cartId);

      if (!cartFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      const productFound = await productModel.findById(productId);

      if (!productFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response:
            "The product that you are trying to add doesn't exist.",
        });
      }

      cartFound.products.push(productId);
      await cartFound.save();

      return { status: 201, ok: true, response: "Product added to cart." };
    } catch (error) {
      console.log(error);
      throw new CustomError(error);
    }
  }

  async updateProducts(id, products) {
    if (!products) {
      throw new CustomError({
        status: 400,
        ok: false,
        response: "Must provide an array of products.",
      });
    }

    if (!Array.isArray(products)) {
      throw new CustomError({
        status: 400,
        ok: false,
        response: "Products must be an array of products.",
      });
    }

    const everyHaveRequiredKeys = products.every(
      (x) => x.id && x.quantity
    );

    if (!everyHaveRequiredKeys) {
      throw new CustomError({
        status: 400,
        ok: false,
        response: "Every product must have ID and quantity.",
      });
    }

    const mappedProducts = products.map((x) => ({
      id: x.id,
      quantity: x.quantity,
    }));

    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        id,
        { products: mappedProducts },
        { new: true }
      );

      if (!updatedCart) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      return { status: 200, ok: true, response: "Cart products updated." };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cartFound = await cartModel.findById(cartId);

      if (!cartFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      const productFound = await productModel.findById(productId);

      if (!productFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response:
            "The product that you are trying to update doesn't exist.",
        });
      }

      const productIndex = cartFound.products.findIndex(
        (id) => id === productId
      );

      if (productIndex === -1) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "The product is not in the cart.",
        });
      }

      cartFound.products[productIndex].quantity = quantity;
      await cartFound.save();

      return { status: 200, ok: true, response: "Product quantity updated." };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cartFound = await cartModel.findById(cartId);

      if (!cartFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      const productFound = await productModel.findById(productId);

      if (!productFound) {
        throw new CustomError({
          status: 404,
          ok: false,
          response:
            "The product that you are trying to delete doesn't exist.",
        });
      }

      const productIndex = cartFound.products.findIndex(
        (id) => id === productId
      );

      if (productIndex === -1) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "The product is not in the cart.",
        });
      }

      cartFound.products.splice(productIndex, 1);
      await cartFound.save();

      return { status: 200, ok: true, response: "Product removed from cart." };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async deleteProductsFromCart(id) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(
        id,
        { products: [] },
        { new: true }
      );

      if (!updatedCart) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      return { status: 200, ok: true, response: "Products removed from cart." };
    } catch (error) {
      throw new CustomError(error);
    }
  }

  async deleteCart(id) {
    try {
      const deletedCart = await cartModel.findByIdAndDelete(id);

      if (!deletedCart) {
        throw new CustomError({
          status: 404,
          ok: false,
          response: "Cart not found.",
        });
      }

      return { status: 200, ok: true, response: "Cart deleted." };
    } catch (error) {
      throw new CustomError(error);
    }
  }
}
