import express from "express";
import {
  createExpenseCategory,
  deleteExpenseCategory,
  getExpenseCategories,
  getExpenseCategoryDetail,
  updateExpenseCategory,
} from "./expenseCategories.controller.js";

const router = express.Router();

// Get all categories with pagination and optional filtering
router.get("/all", getExpenseCategories);

// Get single category detail
router.get("/:id", getExpenseCategoryDetail);

// Create new category
router.post("/", createExpenseCategory);

// Update category
router.put("/:id", updateExpenseCategory);

// Delete category
router.delete("/:id", deleteExpenseCategory);

export default router;
