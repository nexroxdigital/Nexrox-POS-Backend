import Purchase from "./purchase.model.js";

// Create new purchase
export const createPurchase = async (data) => {
  return await Purchase.create(data);
};

// Get all purchases
export const getAllPurchases = async () => {
  return await Purchase.find()
    .populate("items.supplier")
    .populate("items.lots.productId")
    .sort({ createdAt: -1 });
};

// Get single purchase by ID
export const getPurchaseById = async (id) => {
  return await Purchase.findById(id)
    .populate("items.supplier")
    .populate("items.lots.productId");
};

// Update purchase
export const updatePurchase = async (id, data) => {
  return await Purchase.findByIdAndUpdate(id, data, { new: true });
};


