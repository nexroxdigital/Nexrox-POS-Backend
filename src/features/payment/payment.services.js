import Payment from "./payment.model.js";

// @desc    create new payment
// @route   POST /api/v1/payments/all/:supplierId
export const createTransaction = async (data) => {
  const transaction = new Payment(data);
  return await transaction.save();
};

// @desc    Get all transaction by supplier
// @route   GET /api/v1/payments/all/:supplierId
export const getPaymentsBySupplier = async (
  supplierId,
  page,
  limit,
  filters = {}
) => {
  const skip = (page - 1) * limit;

  const query = {};

  // Filter by date range
  if (filters.fromDate || filters.toDate) {
    query.sellDate = {};
    if (filters.fromDate) query.sellDate.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.sellDate.$lte = new Date(filters.toDate);
  }

  let transactions = await Payment.find({ supplierId })
    .populate("supplierId")
    .populate("inventory_lot_ids")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    transactions,
  };
};

// @desc    view details information
// @route   GET /api/v1/payments/details/:id
export const getPaymentById = async (id) => {
  return await Payment.findById(id)
    .populate("supplierId")
    .populate("inventory_lot_ids");
};
