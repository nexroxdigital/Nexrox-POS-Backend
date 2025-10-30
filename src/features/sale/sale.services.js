import Sale from "./sale.model.js";

export const createSale = async (saleData) => {
  if (!saleData.sale_date || !saleData.customerId) {
    throw new Error("sale_date and customerId are required");
  }

  const sale = await Sale.create(saleData);
  return sale;
};

export const getAllSales = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Sale.countDocuments();

  const sales = await Sale.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("customerId", "name phone email")
    .populate("items.productId", "name category unit")
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    sales,
  };
};

export const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate("customerId", "name phone email")
    .populate("items.productId", "name category unit")
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return sale;
};
