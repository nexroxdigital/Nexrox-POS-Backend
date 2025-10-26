import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./categories.controller.js";

const router = express.Router();

// get all categories
router.get("/all", getAllCategories);

// get details view
router.get("/details/:id", getCategoryById);

// add new view category
router.post("/add", createCategory);

// update category
router.put("/update/:id", updateCategory);

// delete category
router.delete("/delete/:id", deleteCategory);

export default router;
