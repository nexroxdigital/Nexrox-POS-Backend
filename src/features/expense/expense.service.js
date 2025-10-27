import Expense from "./expense.model.js";

// Create
export const createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

// Get all
export const getAllExpenses = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Supplier.countDocuments();

  const expenses = await Expense.find()
    .populate("expense_by", "name email")
    .populate("choose_account", "name account_type balance")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    expenses,
  };
};
// Update
export const updateExpense = async (id, data) => {
  return await Expense.findByIdAndUpdate(id, data, { new: true })
    .populate("expense_by", "name email")
    .populate("choose_account", "name account_type balance");
};
