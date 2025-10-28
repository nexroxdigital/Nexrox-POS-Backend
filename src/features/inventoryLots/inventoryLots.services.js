import purchaseModel from "../purchase/purchase.model.js";
import inventoryLotsModel from "./inventoryLots.model.js";

// @desc create lost from purchase list
// @route   POST /api/v1/inventoryLots/add
// @access  Admin
export const createLotsForPurchase = async (purchaseId) => {
  const selectedData = await purchaseModel.findById(purchaseId);

  if (!selectedData) {
    throw new Error("Purchase not found");
  }

  if (selectedData.is_lots_created) {
    throw new Error("Lots already created for this purchase");
  }

  const lotsToCreate = [];

  for (const item of selectedData.items) {
    for (const lot of item.lots) {
      // Check if lot_name already exists
      const existingLot = await inventoryLotsModel.findOne({
        lot_name: lot.lot_name,
      });
      if (existingLot) {
        throw new Error(`Lot name "${lot.lot_name}" already exists`);
      }

      lotsToCreate.push({
        lot_name: lot.lot_name,
        purchase_date: selectedData.purchase_date,
        status: "in stock",
        hasCommission: lot.commission_rate > 0,
        productsId: lot.productId,
        supplierId: item.supplier,
        purchaseListId: purchaseId,
        carat: {
          carat_Type_1: lot.carat.carat_Type_1,
          carat_Type_2: lot.carat.carat_Type_2,
        },
        costs: {
          unitCost: lot.unit_Cost,
          commissionRate: lot.commission_rate || 0,
        },
      });
    }
  }

  // Create lots
  await inventoryLotsModel.insertMany(lotsToCreate);

  // Update purchase
  selectedData.is_lots_created = true;
  await selectedData.save();

  return lotsToCreate.length; // return number of lots created
};

// @desc Get all inventory lots
// @route   GET /api/v1/inventoryLots/all
// @access  Admin
export const getAllLots = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await inventoryLotsModel.countDocuments();

  const lots = await inventoryLotsModel
    .find()
    .populate("productsId", "productName")
    .populate("supplierId", "name")
    .populate("purchaseListId", "purchase_date status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    lots,
  };
};

// @desc Get lot details by ID
// @route   GET /api/v1/inventoryLots/details
// @access  Admin
export const getLotById = async (lotId) => {
  const lot = await inventoryLotsModel
    .findById(lotId)
    .populate("productsId", "productName description")
    .populate("supplierId", "name email")
    .populate("purchaseListId", "purchase_date status");

  if (!lot) {
    throw new Error("Lot not found");
  }

  return lot;
};

// Update lot status
// @route   GET /api/v1/inventoryLots/details
// @access  Admin
export const updateLotStatus = async (lotId, newStatus) => {
  const allowedStatuses = ["in stock", "stock out"];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  const lot = await inventoryLotsModel.findById(lotId);
  if (!lot) {
    throw new Error("Lot not found");
  }

  lot.status = newStatus;
  await lot.save();

  return lot;
};
