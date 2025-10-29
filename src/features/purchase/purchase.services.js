import Purchase from "./purchase.model.js";

// @desc   Create new purchase
// @access  Admin
export const createPurchase = async (data) => {
  return await Purchase.create(data);
};

// @desc Get all purchases
// @access  Admin
export const getAllPurchases = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Purchase.countDocuments();

  const purchase = await Purchase.find()
    .populate("items.supplier")
    .populate("items.lots.productId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    purchase,
  };
};

// @desc Get single purchase by ID
// @access  Admin
export const getPurchaseById = async (id) => {
  return await Purchase.findById(id)
    .populate("items.supplier")
    .populate("items.lots.productId");
};

// @desc Update purchase
// @access  Admin
export const updatePurchase = async (id, data) => {
  return await Purchase.findByIdAndUpdate(id, data, { new: true });
};

// @desc Update the status of a purchase by ID
// @access  Admin
export const updatePurchaseStatus = async (purchaseId, status) => {
  const allowedStatuses = ["on the way", "received", "canceled"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const purchase = await Purchase.findById(purchaseId);
  if (!purchase) {
    throw new Error("Purchase not found");
  }

  purchase.status = status;
  await purchase.save();

  return purchase;
};
