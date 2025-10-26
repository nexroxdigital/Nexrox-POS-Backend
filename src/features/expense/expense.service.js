import Expense from "./expense.model.js";

// Create
export const createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

// Get all
export const getAllExpenses = async (skip, limit) => {
  return await Expense.find()
    .populate("expense_by", "name email")
    .populate("choose_account", "name account_type balance")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};
// Update
export const updateExpense = async (id, data) => {
  return await Expense.findByIdAndUpdate(id, data, { new: true })
    .populate("expense_by", "name email")
    .populate("choose_account", "name account_type balance");
};
