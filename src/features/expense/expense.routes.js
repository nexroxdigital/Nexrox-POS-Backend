import express from "express";
import {
  createExpense,
  getAllExpenses,
  updateExpense,
} from "./expense.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// post expense
router.post("/add", authMiddleware, createExpense);

// get all expense
router.get("/all", getAllExpenses);

// get update
router.put("/update/:id", authMiddleware, updateExpense);

export default router;
