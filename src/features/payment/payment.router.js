import express from "express";
import {
  createTransaction,
  getAllBySupplier,
  getTransactionDetails,
} from "./payment.controller.js";

const router = express.Router();

// CREATE a new transaction
router.post("/add", createTransaction);

// GET all transactions by supplier
router.get("/all/:supplierId", getAllBySupplier);

// GET one transaction by id
router.get("/details/:id", getTransactionDetails);

export default router;
