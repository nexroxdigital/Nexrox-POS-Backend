import Expense from "./expense.model.js";

// Create
export const createExpense = async (data) => {
  const expense = new Expense(data);
  return await expense.save();
};

// Get all
// Get all
export const getAllExpenses = async (page, limit, filters = {}) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (filters.category) {
    query.expense_category = filters.category;
  }

  if (filters.expense_for_user) {
    query.expense_for_user = filters.expense_for_user;
  }

  if (filters.date) {
    query.date = filters.date;
  }

  if (filters.search) {
    query.$or = [
      { reference_num: { $regex: filters.search, $options: "i" } },
      { expense_category: { $regex: filters.search, $options: "i" } },
      { expense_for_user: { $regex: filters.search, $options: "i" } },
    ];
  }

  const total = await Expense.countDocuments(query);

  const expenses = await Expense.find(query)
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
