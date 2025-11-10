import mongoose from "mongoose";
import { CrateTotal, InventoryCrate } from "./inventoryCrate.model.js";
import supplierModel from "../supplier/supplier.model.js";

// @desc    Create a new crate transition
// @access  Admin
export const createCrateTransitionService = async (data) => {
  console.log("data form inventory crate", data);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { date, crate_type_1_qty, crate_type_2_qty, stockType, note } = data;

    // Create the crate transition exactly like your original code
    const newTransition = await InventoryCrate.create(
      [
        {
          date,
          supplierId: null,
          stockType,
          crate_type_1_qty,
          crate_type_2_qty,
          status: "IN",
          note,
        },
      ],
      { session }
    );

    // Update totals
    let totals = await CrateTotal.findOne().session(session);
    if (!totals) {
      totals = await CrateTotal.create([{}], { session });
      totals = totals[0];
    }

    if (stockType !== "re-stock") {
      totals.type_1_total += crate_type_1_qty;
      totals.type_2_total += crate_type_2_qty;
    }

    totals.remaining_type_1 += crate_type_1_qty;
    totals.remaining_type_2 += crate_type_2_qty;

    await totals.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newTransition[0]; // return the created document
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// @desc    Get all crate transitions
// @access  Admin
export const getAllCrateTransitionsService = async (page, limit) => {
  const skip = (page - 1) * limit;

  const transitions = await InventoryCrate.find()
    .populate("supplierId", "basic_info.name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await InventoryCrate.countDocuments();

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    transitions,
  };
};

// @desc    Add crates for a supplier and update totals
// @access  Admin
export const addCratesForSupplierService = async (supplierId, crate_info) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update supplier crate info
    const supplier = await supplierModel.findById(supplierId).session(session);
    if (!supplier) throw new Error("Supplier not found");

    supplier.crate_info.crate1 += crate_info.crate1;
    supplier.crate_info.crate2 += crate_info.crate2;

    // Update prices only if provided
    if (crate_info.crate1Price !== undefined) {
      supplier.crate_info.crate1Price = crate_info.crate1Price;
    }
    if (crate_info.crate2Price !== undefined) {
      supplier.crate_info.crate2Price = crate_info.crate2Price;
    }

    await supplier.save({ session });

    // Create InventoryCrate record
    const inventoryCrate = await InventoryCrate.create(
      [
        {
          date: new Date().toISOString().split("T")[0],
          supplierId,
          crate_type_1_qty: crate_info.crate1,
          crate_type_2_qty: crate_info.crate2,
          status: "OUT",
          note: `Crates sent to supplier ${supplierId}`,
        },
      ],
      { session }
    );

    // Update CrateTotal
    let totals = await CrateTotal.findOne().session(session);
    if (!totals) {
      totals = await CrateTotal.create([{}], { session });
      totals = totals[0];
    }

    // Update remaining crates
    totals.remaining_type_1 =
      (totals.remaining_type_1 || 0) - crate_info.crate1;
    totals.remaining_type_2 =
      (totals.remaining_type_2 || 0) - crate_info.crate2;

    await totals.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { supplier, inventoryCrate: inventoryCrate[0], totals };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// @desc    Update supplier crate info OR update total crates if no supplier
// @access  Admin
export const updateCrateOrSupplierService = async (
  supplierId,
  inventoryCratesId,
  crate_info
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get or create totals
    let totals = await CrateTotal.findOne().session(session);
    if (!totals) {
      totals = await CrateTotal.create([{}], { session });
      totals = totals[0];
    }

    // CASE 1: If no supplierId → update existing InventoryCrate and CrateTotal
    if (!supplierId) {
      if (!inventoryCratesId) {
        throw new Error("inventoryCratesId is required for inventory update");
      }

      // Find existing InventoryCrate document
      const inventory =
        await InventoryCrate.findById(inventoryCratesId).session(session);
      if (!inventory) {
        throw new Error("InventoryCrate record not found");
      }

      // Get existing totals document
      let totals = await CrateTotal.findOne().session(session);
      if (!totals) {
        totals = (await CrateTotal.create([{}], { session }))[0];
      }

      // Previous quantities
      const prev1 = inventory.crate_type_1_qty || 0;
      const prev2 = inventory.crate_type_2_qty || 0;

      // New quantities (if not provided, keep old)
      const new1 = crate_info.crate1 ?? prev1;
      const new2 = crate_info.crate2 ?? prev2;

      // Calculate differences
      const diff1 = new1 - prev1;
      const diff2 = new2 - prev2;

      // Validation: ensure remaining doesn’t go negative
      if (diff1 < 0 && totals.remaining_type_1 < Math.abs(diff1)) {
        throw new Error(
          `Not enough Type 1 crates. Available: ${totals.remaining_type_1}`
        );
      }
      if (diff2 < 0 && totals.remaining_type_2 < Math.abs(diff2)) {
        throw new Error(
          `Not enough Type 2 crates. Available: ${totals.remaining_type_2}`
        );
      }

      // Update crate totals based on diff
      totals.type_1_total += diff1;
      totals.remaining_type_1 += diff1;
      totals.type_2_total += diff2;
      totals.remaining_type_2 += diff2;

      await totals.save({ session });

      // Update the existing inventory document
      inventory.crate_type_1_qty = new1;
      inventory.crate_type_2_qty = new2;
      inventory.isUpdated = true;
      inventory.date = new Date().toISOString();

      await inventory.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        message: "Inventory crate updated and totals adjusted successfully",
        totals,
        inventory,
      };
    }

    // CASE 2: SupplierId provided → update supplier and totals
    const supplier = await supplierModel.findById(supplierId).session(session);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    const prevCrate1 = supplier.crate_info.crate1 || 0;
    const prevCrate2 = supplier.crate_info.crate2 || 0;

    const newCrate1 = crate_info.crate1 ?? prevCrate1;
    const newCrate2 = crate_info.crate2 ?? prevCrate2;

    const diff1 = newCrate1 - prevCrate1; // positive = taking more
    const diff2 = newCrate2 - prevCrate2;

    // Validation
    if (diff1 > 0 && totals.remaining_type_1 < diff1) {
      throw new Error(
        `Not enough Type 1 crates. Available: ${totals.remaining_type_1}`
      );
    }
    if (diff2 > 0 && totals.remaining_type_2 < diff2) {
      throw new Error(
        `Not enough Type 2 crates. Available: ${totals.remaining_type_2}`
      );
    }

    // Update totals
    totals.remaining_type_1 -= diff1;
    totals.remaining_type_2 -= diff2;

    await totals.save({ session });

    // Update supplier info
    supplier.crate_info.crate1 = newCrate1;
    supplier.crate_info.crate2 = newCrate2;

    if (crate_info.crate1Price !== undefined) {
      supplier.crate_info.crate1Price = crate_info.crate1Price;
    }
    if (crate_info.crate2Price !== undefined) {
      supplier.crate_info.crate2Price = crate_info.crate2Price;
    }

    await supplier.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Supplier crate info and totals updated successfully",
      supplier,
      totals,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

// @desc  Get the current crate totals. Creates default if missing.
// @access  Admin
export const getCrateTotalsService = async () => {
  let totals = await CrateTotal.findOne();

  if (!totals) {
    totals = await CrateTotal.create({});
  }

  return totals;
};
