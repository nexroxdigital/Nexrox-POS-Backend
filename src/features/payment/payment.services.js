import mongoose from "mongoose";
import Payment from "./payment.model.js";
import inventoryLotsModel from "../inventoryLots/inventoryLots.model.js";
import supplierModel from "../supplier/supplier.model.js";

// @desc    create new payment
// @route   POST /api/v1/payments/all/:supplierId
export const createTransaction = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Save payment
    const payment = new Payment(data);
    await payment.save({ session });

    // Update related InventoryLots
    const lotUpdates = payment.selected_lots_info.map(async (lotInfo) => {
      const { lot_id, profit, discount } = lotInfo;

      // Build dynamic update object
      const updateData = {
        payment_status: "paid",
        "profits.lotProfit": profit,
        extra_discount: discount,
      };

      return inventoryLotsModel.findByIdAndUpdate(
        lot_id,
        { $set: updateData },
        { new: true, session }
      );
    });

    await Promise.all(lotUpdates);

    // Update Supplier balance and due
    const supplier = await supplierModel
      .findById(payment.supplierId)
      .session(session);

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    const prevBalance = supplier.account_info.balance || 0;
    const prevDue = supplier.account_info.due || 0;

    const newBalance = prevBalance - (payment.amount_from_balance || 0);
    const newDue = prevDue + (payment.need_to_pay_due || 0);

    supplier.account_info.balance = Math.max(newBalance, 0);
    supplier.account_info.due = newDue;

    await supplier.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment and related data saved successfully.",
      payment,
    };
  } catch (error) {
    // Rollback all changes
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error);
    throw new Error(error.message || "Failed to create transaction");
  }
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
