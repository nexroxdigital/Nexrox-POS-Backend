import customerModel from "../customer/customer.model.js";
import supplierModel from "../supplier/supplier.model.js";
import Balance from "./balance.model.js";
import mongoose from "mongoose";

// @desc    Create a new balance
// @access  Admin
export const createBalance = async (data) => {
  console.log(data);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create balance
    const balance = new Balance(data);
    const savedBalance = await balance.save({ session });

    // Update related profile
    if (data.role === "customer") {
      const customer = await customerModel.findByIdAndUpdate(
        data.balance_for,
        {
          $inc: { "account_info.balance": data.amount },
        },
        { new: true, session }
      );

      if (!customer) throw new Error("Customer not found");
    } else if (data.role === "supplier") {
      const supplier = await supplierModel.findByIdAndUpdate(
        data.balance_for,
        {
          $inc: { "account_info.balance": data.amount },
        },
        { new: true, session }
      );

      if (!supplier) throw new Error("Supplier not found");
    } else {
      throw new Error("Invalid type or missing ID field");
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return savedBalance;
  } catch (error) {
    // Rollback if anything fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// @desc    Get all balances
// @access  Admin or Accountant
export const getAllBalances = async (id, page, limit, filters = {}) => {
  const skip = (page - 1) * limit;

  const query = { balance_for: id };

  // Filter by date range
  if (filters.fromDate || filters.toDate) {
    query.sellDate = {};
    if (filters.fromDate) query.sellDate.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.sellDate.$lte = new Date(filters.toDate);
  }

  let balances = await Balance.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Balance.countDocuments(query);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    balances,
  };
};

// @desc    Get balance details by ID
// @access  Admin or Accountant
export const getBalanceById = async (id) => {
  return await Balance.findById(id);
};
