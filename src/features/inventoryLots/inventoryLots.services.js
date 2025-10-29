import mongoose from "mongoose";
import purchaseModel from "../purchase/purchase.model.js";
import supplierModel from "../supplier/supplier.model.js";
import inventoryLotsModel from "./inventoryLots.model.js";

// @desc create lost from purchase list also update crate in supplier profile
// @route   POST /api/v1/inventoryLots/add
// @access  Admin
// export const createLotsForPurchase = async (purchaseId) => {
//   const selectedData = await purchaseModel.findById(purchaseId);

//   if (!selectedData) {
//     throw new Error("Purchase not found");
//   }

//   if (selectedData.is_lots_created) {
//     throw new Error("Lots already created for this purchase");
//   }

//   const lotsToCreate = [];

//   for (const item of selectedData.items) {
//     for (const lot of item.lots) {
//       // Check if lot_name already exists
//       const existingLot = await inventoryLotsModel.findOne({
//         lot_name: lot.lot_name,
//       });
//       if (existingLot) {
//         throw new Error(`Lot name "${lot.lot_name}" already exists`);
//       }

//       lotsToCreate.push({
//         lot_name: lot.lot_name,
//         purchase_date: selectedData.purchase_date,
//         status: "in stock",
//         hasCommission: lot.commission_rate > 0,
//         productsId: lot.productId,
//         supplierId: item.supplier,
//         purchaseListId: purchaseId,
//         carat: {
//           carat_Type_1: lot.carat.carat_Type_1,
//           carat_Type_2: lot.carat.carat_Type_2,
//         },
//         costs: {
//           unitCost: lot.unit_Cost,
//           commissionRate: lot.commission_rate || 0,
//         },
//       });
//     }
//   }

//   // Create lots
//   await inventoryLotsModel.insertMany(lotsToCreate);

//   // Update purchase
//   selectedData.is_lots_created = true;
//   await selectedData.save();

//   return lotsToCreate.length; // return number of lots created
// };

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
          carat: {
            carat_Type_1: lot.carat.carat_Type_1,
            carat_Type_2: lot.carat.carat_Type_2,
          },
          costs: {
            unitCost: lot.unit_Cost,
            commissionRate: lot.commission_rate || 0,
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
