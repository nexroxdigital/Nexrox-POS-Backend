import mongoose from "mongoose";
import Supplier from "../supplier/supplier.model.js";
import Purchase from "./purchase.model.js";

// @desc   Create new purchase
// @access  Admin
export const createPurchase = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log("hit servcies");
  try {
    // Create the purchase document
    const [purchase] = await Purchase.create([data], { session });

    // Loop over each supplier in the purchase
    for (const item of data.items) {
      const supplierId = item.supplier;

      // Sum all lots for this supplier
      let totalCaratType1 = 0;
      let totalCaratType2 = 0;

      for (const lot of item.lots) {
        totalCaratType1 += Number(lot.carat?.carat_Type_1 || 0);
        totalCaratType2 += Number(lot.carat?.carat_Type_2 || 0);
      }

      // Find supplier
      const supplier = await Supplier.findById(supplierId).session(session);
      if (!supplier) throw new Error(`Supplier not found: ${supplierId}`);

      // Current crates
      const { crate1, crate2, needToGiveCrate1, needToGiveCrate2 } =
        supplier.crate_info;

      // --- Type 1 logic ---
      let newCrate1 = crate1;
      let newNeedToGiveCrate1 = needToGiveCrate1 || 0;

      if (totalCaratType1 > crate1) {
        const shortage = totalCaratType1 - crate1;
        newCrate1 = 0;
        newNeedToGiveCrate1 += shortage;
      } else {
        newCrate1 = crate1 - totalCaratType1;
      }

      // --- Type 2 logic ---
      let newCrate2 = crate2;
      let newNeedToGiveCrate2 = needToGiveCrate2 || 0;

      if (totalCaratType2 > crate2) {
        const shortage = totalCaratType2 - crate2;
        newCrate2 = 0;
        newNeedToGiveCrate2 += shortage;
      } else {
        newCrate2 = crate2 - totalCaratType2;
      }

      // Update supplier crate info
      supplier.crate_info.crate1 = newCrate1;
      supplier.crate_info.crate2 = newCrate2;
      supplier.crate_info.needToGiveCrate1 = newNeedToGiveCrate1;
      supplier.crate_info.needToGiveCrate2 = newNeedToGiveCrate2;

      await supplier.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return purchase;
  } catch (error) {
    // Rollback everything on failure
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to create purchase: ${error.message}`);
  }
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
