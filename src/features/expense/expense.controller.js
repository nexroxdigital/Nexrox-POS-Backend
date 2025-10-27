import { logActivity } from "../../utils/activityLogger.js";
import * as expenseService from "./expense.service.js";

// @desc    Create expense
// @route   POST /api/v1/expenses
export const createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const expense = await expenseService.createExpense(req.body);

    // Log activity
    await logActivity({
      model_name: "Expense",
      logs_fields_id: expense._id,
      by: userId,
      action: "Created",
      note: `${expense.amount}  for ${expense.expense_for} expense by ${userEmail}`,
    });

    res.status(201).json({
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all expenses
// @route   GET /api/v1/expenses
export const getAllExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const expenses = await expenseService.getAllExpenses(
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update expense
// @route   PUT /api/v1/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const updated = await expenseService.updateExpense(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Log activity
    await logActivity({
      model_name: "Expense",
      logs_fields_id: updated._id,
      by: userId,
      action: "Updated",
      note: `${updated.amount}  for ${updated.expense_for} updated by ${userEmail}`,
    });

    res.status(200).json({
      message: "Expense updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
