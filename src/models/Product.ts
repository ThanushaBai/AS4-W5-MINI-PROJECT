import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;