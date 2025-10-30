import Sale from "./sale.model.js";

export const createSale = async (saleData) => {
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
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    sales,
  };
};

export const getAllSalesByCustomer = async (id) => {
  console.log(id);

  const sales = await Sale.find({ customerId: id })
    .sort({ createdAt: -1 })
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  const total = sales.length;

  return {
    total,
    sales,
  };
  return {};
};

export const getSaleById = async (id) => {
  const sale = await Sale.findById(id)
    .populate(
      "customerId",
      "basic_info.name contact_info.phone contact_info.email"
    )
    .populate({
      path: "items.productId",
      select: "productName basePrice categoryId",
      populate: {
        path: "categoryId",
        select: "categoryName",
      },
    })
    .populate("items.selected_lots.lotId", "lot_name commissionRate");

  return sale;
};
