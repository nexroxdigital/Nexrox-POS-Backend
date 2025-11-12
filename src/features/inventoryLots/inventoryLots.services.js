import mongoose from "mongoose";
import purchaseModel from "../purchase/purchase.model.js";
import supplierModel from "../supplier/supplier.model.js";
import inventoryLotsModel from "./inventoryLots.model.js";

// @desc create lost from purchase list also update crate in supplier profile
// @access  Admin
export const createLotsForPurchase = async (purchaseId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find purchase
    const purchase = await purchaseModel.findById(purchaseId).session(session);
    if (!purchase) throw new Error("Purchase not found");
    if (purchase.is_lots_created)
      throw new Error("Lots already created for this purchase");

    const lotsToCreate = [];

    // Loop over suppliers
    for (const item of purchase.items) {
      const supplierId = item.supplier.toString();
      const supplier = await supplierModel
        .findById(supplierId)
        .session(session);
      if (!supplier) throw new Error(`Supplier not found: ${supplierId}`);

      let {
        crate1,
        crate2,
        needToGiveCrate1 = 0,
        needToGiveCrate2 = 0,
      } = supplier.crate_info;

      // Loop over lots for this supplier
      for (const lot of item.lots) {
        // Check duplicate lot
        const existingLot = await inventoryLotsModel
          .findOne({ lot_name: lot.lot_name })
          .session(session);
        if (existingLot)
          throw new Error(`Lot name "${lot.lot_name}" already exists`);

        lotsToCreate.push({
          lot_name: lot.lot_name,
          purchase_date: purchase.purchase_date,
          status: "in stock",
          hasCommission: lot.commission_rate > 0,
          productsId: lot.productId,
          supplierId,
          purchaseListId: purchaseId,
          box_quantity: lot.box_quantity,
          remaining_boxes: lot.box_quantity,
          carat: {
            carat_Type_1: lot.carat.carat_Type_1,
            carat_Type_2: lot.carat.carat_Type_2,
          },
          costs: {
            unitCost: lot.unit_Cost,
            commissionRate: lot.commission_rate || 0,
          },

          expenses: {
            labour: lot.expenses.labour,
            transportation: lot.expenses.transportation,
            van_vara: lot.expenses.van_vara,
            moshjid: lot.expenses.moshjid,
            trading_post: lot.expenses.trading_post,
            other_expenses: lot.expenses.other_expenses,
            total_expenses:
              lot.expenses.labour +
              lot.expenses.transportation +
              lot.expenses.van_vara +
              lot.expenses.moshjid +
              lot.expenses.trading_post +
              lot.expenses.other_expenses,
          },
        });

        // Deduct crate per lot (Type 1)
        if (lot.carat.carat_Type_1 > crate1) {
          needToGiveCrate1 += lot.carat.carat_Type_1 - crate1;
          crate1 = 0;
        } else {
          crate1 -= lot.carat.carat_Type_1;
        }

        // Deduct crate per lot (Type 2)
        if (lot.carat.carat_Type_2 > crate2) {
          needToGiveCrate2 += lot.carat.carat_Type_2 - crate2;
          crate2 = 0;
        } else {
          crate2 -= lot.carat.carat_Type_2;
        }
      }

      // Update supplier crate info
      supplier.crate_info.crate1 = crate1;
      supplier.crate_info.crate2 = crate2;
      supplier.crate_info.needToGiveCrate1 = needToGiveCrate1;
      supplier.crate_info.needToGiveCrate2 = needToGiveCrate2;

      await supplier.save({ session });
    }

    // Insert all lots
    await inventoryLotsModel.insertMany(lotsToCreate, { session });

    // Mark purchase as lots created
    purchase.is_lots_created = true;
    await purchase.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, createdLots: lotsToCreate.length };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to create lots: ${error.message}`);
  }
};

// @desc Get all inventory lots
// @access  Admin
export const getAllLots = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await inventoryLotsModel.countDocuments();

  const lots = await inventoryLotsModel
    .find()
    .populate("productsId", "productName")
    .populate("supplierId", "basic_info")
    .populate("purchaseListId", "purchase_date status")
    .sort({ status: 1, createdAt: -1 })
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

// @desc Get all lots by supplier
// @access  Admin
export const getAllLotsBySupplier = async (
  supplierId,
  page,
  limit,
  filters = {}
) => {
  const skip = (page - 1) * limit;

  const aggregationPipeline = [
    // Stage 1: Match inventory lots by supplier
    {
      $match: {
        supplierId: new mongoose.Types.ObjectId(supplierId),
        ...(filters.fromDate || filters.toDate
          ? {
              createdAt: {
                ...(filters.fromDate && { $gte: new Date(filters.fromDate) }),
                ...(filters.toDate && { $lte: new Date(filters.toDate) }),
              },
            }
          : {}),
      },
    },

    // Stage 2: Lookup products with search filter
    {
      $lookup: {
        from: "products",
        localField: "productsId",
        foreignField: "_id",
        as: "productsId",
        pipeline: [
          // Apply product search filter here
          ...(filters.search
            ? [
                {
                  $match: {
                    productName: { $regex: filters.search, $options: "i" },
                  },
                },
              ]
            : []),
          {
            $project: { productName: 1, description: 1, createdAt: 1 },
          },
        ],
      },
    },
    // Stage 3: Filter out lots with empty products (ONLY if search is applied)
    ...(filters.search
      ? [
          {
            $match: {
              "productsId.0": { $exists: true }, // At least one product exists
            },
          },
        ]
      : []),
    // Stage 4: Lookup supplier
    {
      $lookup: {
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "supplierId",
        pipeline: [
          {
            $project: { name: 1, email: 1 },
          },
        ],
      },
    },
    {
      $unwind: "$supplierId", // Convert array to object
    },
    // Stage 5: Lookup purchase list
    {
      $lookup: {
        from: "purchase", // Make sure this matches your collection name
        localField: "purchaseListId",
        foreignField: "_id",
        as: "purchaseListId",
        pipeline: [
          {
            $project: { purchase_date: 1, status: 1 },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$purchaseListId",
        preserveNullAndEmptyArrays: true, // Keep lots even if no purchase list
      },
    },
    // Stage 6: Sort and paginate
    { $sort: { createdAt: -1 } },
  ];

  // Execute aggregation for data
  const lots = await inventoryLotsModel.aggregate([
    ...aggregationPipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  // Execute aggregation for total count
  const totalResult = await inventoryLotsModel.aggregate([
    ...aggregationPipeline,
    { $count: "total" },
  ]);

  const total = totalResult[0]?.total || 0;

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    lots,
  };
};

// @desc Update lot status
// @access  Admin
// export const updateLotStatus = async (lotId, newStatus) => {
//   const allowedStatuses = ["in stock", "stock out"];

//   if (!allowedStatuses.includes(newStatus)) {
//     throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
//   }

//   const lot = await inventoryLotsModel.findById(lotId);
//   if (!lot) {
//     throw new Error("Lot not found");
//   }

//   lot.status = newStatus;
//   await lot.save();

//   return lot;
// };
export const updateLotStatus = async (lotId, newStatus) => {
  const allowedStatuses = ["in stock", "stock out"];

  // Validate incoming status
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  // Find the lot
  const lot = await inventoryLotsModel.findById(lotId);
  if (!lot) {
    throw new Error("Lot not found");
  }

  // Update status
  lot.status = newStatus;

  // Calculate Loss
  const { totalKgSold, totalSoldPrice } = lot.sales;
  const { unitCost } = lot.costs;
  const { box_quantity } = lot;
  const { hasCommission } = lot;

  let originalPrice = 0;
  let loss = 0;

  // Check if product is box-based or kg-based
  if (box_quantity && box_quantity > 0) {
    // Box-based calculation
    originalPrice = box_quantity * unitCost - totalSoldPrice;
    loss = originalPrice > 0 ? originalPrice : 0;
  } else {
    //  Kg-based calculation
    originalPrice = totalKgSold * unitCost;
    loss = originalPrice - totalSoldPrice;
    if (loss < 0) loss = 0;
  }

  // Save loss
  lot.profits.lot_loss = loss;

  // Save customerProfit only if hasCommission = false
  if (!hasCommission) {
    lot.profits.customerProfit = totalSoldPrice - originalPrice;
  }

  await lot.save();

  return lot;
};

// @desc Controller to get all in-stock loots
// @access  Admin
export const getAllInStockLots = async () => {
  const lots = await inventoryLotsModel
    .find({ status: "in stock" })
    .sort({ createdAt: -1 })
    .populate("productsId", "productName")
    .populate("supplierId", "basic_info.name")
    .populate("purchaseListId", "purchase_date");

  return lots;
};

// @desc    Get all unpaid & out-of-stock lots
// @access  Admin
export const getUnpaidAndOutOfStockLots = async () => {
  return await inventoryLotsModel
    .find({
      payment_status: "unpaid",
      status: "stock out",
    })
    .populate("supplierId", "name phone")
    .populate("productsId", "product_name")
    .populate("purchaseListId", "invoice_number")
    .sort({ createdAt: -1 });
};

// @desc    Get all unpaid & out-of-stock lots
// @access  Admin
export const adjustStockService = async (lotId, stockAdjustData) => {
  const { unit_quantity, reason_note } = stockAdjustData;

  const lot = await inventoryLotsModel.findById(lotId);
  if (!lot) {
    throw new Error("Inventory lot not found");
  }

  const { totalKgSold, totalSoldPrice } = lot.sales;
  const { unitCost } = lot.costs;
  const { box_quantity } = lot;
  const { hasCommission } = lot;

  // Update stock_adjust fields
  lot.stock_adjust.unit_quantity = unit_quantity;
  lot.stock_adjust.reason_note = reason_note;

  let originalPrice = 0;
  let loss = 0;

  // Determine calculation type
  if (box_quantity && box_quantity > 0) {
    // BOX-based product
    originalPrice = box_quantity * unitCost - totalSoldPrice;
    loss = originalPrice > 0 ? originalPrice : 0;
  } else {
    // KG-based product
    originalPrice = (totalKgSold + unit_quantity) * unitCost;
    loss = originalPrice - totalSoldPrice;
    if (loss < 0) loss = 0;
  }

  // Update profits
  lot.profits.lot_loss = loss;

  if (!hasCommission) {
    lot.profits.customerProfit = totalSoldPrice - originalPrice;
  }

  await lot.save();
  return lot;
};
