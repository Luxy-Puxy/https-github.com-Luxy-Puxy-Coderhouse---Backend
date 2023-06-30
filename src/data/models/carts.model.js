import mongoose from "mongoose";

const cartsCollection = "carts";

// const cartSchema = new mongoose.Schema({
//   products: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "products",
//     },
//   ],
// });

const cartSchema = new mongoose.Schema({
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
  });
  

export const cartModel = mongoose.model(cartsCollection, cartSchema);
