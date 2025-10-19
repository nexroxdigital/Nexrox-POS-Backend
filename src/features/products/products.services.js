import Product from "./products.model.js";

export async function getAllProducts() {
  return await Product.find();
}

export async function createProduct(data) {
  const product = new Product(data);
  return await product.save();
}
