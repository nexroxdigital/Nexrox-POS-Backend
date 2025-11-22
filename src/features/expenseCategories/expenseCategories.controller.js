import * as ExpenseCategoriesService from "./expenseCategories.services.js";

// @desc    Get all expense categories
// @route   GET /api/v1/expense-categories/all
// @access  Public
export const getExpenseCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const categories = await ExpenseCategoriesService.getAllExpenseCategories(
      parseInt(page),
      parseInt(limit),
      { name }
    );

    res.status(200).json({
      success: true,
      ...categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single expense category
// @route   GET /api/v1/expense-categories/:id
// @access  Public
export const getExpenseCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ExpenseCategoriesService.getExpenseCategoryById(id);

    res.status(200).json({
      success: true,
      message: "Expense category retrieved successfully",
      data: category,
    });
  } catch (error) {
    if (error.message === "Expense category not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new expense category
// @route   POST /api/v1/expense-categories
// @access  Public
export const createExpenseCategory = async (req, res) => {
  try {
    const category =
      await ExpenseCategoriesService.createExpenseCategoryService(req.body);
    res.status(201).json({
      success: true,
      message: "Expense category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update expense category
// @route   PUT /api/v1/expense-categories/:id
// @access  Public
export const updateExpenseCategory = async (req, res) => {
  try {
    const updated = await ExpenseCategoriesService.updateExpenseCategoryService(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Expense category updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.message === "Expense category not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete expense category
// @route   DELETE /api/v1/expense-categories/:id
// @access  Public
export const deleteExpenseCategory = async (req, res) => {
  try {
    await ExpenseCategoriesService.deleteExpenseCategoryService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Expense category deleted successfully",
    });
  } catch (error) {
    if (error.message === "Expense category not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
