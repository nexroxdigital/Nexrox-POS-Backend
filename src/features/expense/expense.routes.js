import express from "express";
import {
  createExpense,
  getAllExpenses,
  updateExpense,
} from "./expense.controller.js";

const router = express.Router();

// post expense
router.post("/add", createExpense);

// get all expense
router.get("/all", getAllExpenses);

// get update
router.put("/update/:id", updateExpense);

export default router;
