import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
} from "./purchase.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Create new purchase
router.post("/add", authMiddleware, createPurchase);

// All purchases
router.get("/all", getAllPurchases);

// Single purchase by ID
router.get("/details/:id", getPurchaseById);

// Update purchase
router.put("/update/:id", authMiddleware, updatePurchase);

// toDo : statues change

export default router;
