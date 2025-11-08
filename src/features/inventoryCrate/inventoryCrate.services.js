import mongoose from "mongoose";
import { CrateTotal, InventoryCrate } from "./inventoryCrate.model.js";
import supplierModel from "../supplier/supplier.model.js";

// @desc    Create a new crate transition
// @access  Admin
export const createCrateTransitionService = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { date, crate_type_1_qty, crate_type_2_qty, note } = data;

    // Create the crate transition exactly like your original code
    const newTransition = await InventoryCrate.create(
      [
        {
          date,
          supplierId: null,
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

    totals.type_1_total += crate_type_1_qty;
    totals.type_2_total += crate_type_2_qty;

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
    .populate("supplierId", "supplier_name")
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

// @desc    Update crates for a supplier (e.g., returned crates)
// @access  Admin
export const updateCratesForSupplierService = async (
  supplierId,
  crate_info
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch supplier
    const supplier = await supplierModel.findById(supplierId).session(session);
    if (!supplier) throw new Error("Supplier not found");

    // Update supplier crate info
    supplier.crate_info.crate1 -= crate_info.crate1;
    supplier.crate_info.crate2 -= crate_info.crate2;

    // Update prices only if provided
    if (crate_info.crate1Price !== undefined) {
      supplier.crate_info.crate1Price = crate_info.crate1Price;
    }
    if (crate_info.crate2Price !== undefined) {
      supplier.crate_info.crate2Price = crate_info.crate2Price;
    }

    await supplier.save({ session });

    // Create InventoryCrate record (status: IN)
    const inventoryCrate = await InventoryCrate.create(
      [
        {
          date: new Date().toISOString().split("T")[0],
          supplierId,
          crate_type_1_qty: crate_info.crate1,
          crate_type_2_qty: crate_info.crate2,
          status: "IN",
          note: `Crates received from supplier ${supplierId}`,
        },
      ],
      { session }
    );

    // Update CrateTotal (increase remaining because crates returned)
    let totals = await CrateTotal.findOne().session(session);
    if (!totals) {
      totals = await CrateTotal.create([{}], { session });
      totals = totals[0];
    }

    totals.remaining_type_1 =
      (totals.remaining_type_1 || 0) + crate_info.crate1;
    totals.remaining_type_2 =
      (totals.remaining_type_2 || 0) + crate_info.crate2;

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
export const updateCrateOrSupplierService = async (query, crate_info) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { supplierId } = query;

    // Get or create totals
    let totals = await CrateTotal.findOne().session(session);
    if (!totals) {
      totals = await CrateTotal.create([{}], { session });
      totals = totals[0];
    }

    // CASE 1: If no supplierId → just update totals
    if (!supplierId) {
      totals.type_1_total += crate_info.crate1 || 0;
      totals.remaining_type_1 += crate_info.crate1 || 0;

      totals.type_2_total += crate_info.crate2 || 0;
      totals.remaining_type_2 += crate_info.crate2 || 0;

      await totals.save({ session });

      await InventoryCrate.create(
        [
          {
            date: new Date().toISOString(),
            supplierId: null,
            isUpdated: true,
            crate_type_1_qty: crate_info.crate1 || 0,
            crate_type_2_qty: crate_info.crate2 || 0,
            status: "IN",
            note: "Warehouse crate restock",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { message: "Crate totals updated successfully", totals };
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

    // Add record
    await InventoryCrate.create(
      [
        {
          date: new Date().toISOString(),
          supplierId,
          crate_type_1_qty: diff1,
          crate_type_2_qty: diff2,
          status: diff1 < 0 || diff2 < 0 ? "IN" : "OUT",
          note: "Supplier crate update",
        },
      ],
      { session }
    );

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
