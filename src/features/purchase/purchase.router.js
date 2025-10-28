import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
} from "./purchase.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create new purchase
router.post("/", authMiddleware, createPurchase);

// All purchases
router.get("/", authMiddleware, getAllPurchases);

// Single purchase by ID
router.get("/:id", authMiddleware, getPurchaseById);

// Update purchase
router.put("/:id", authMiddleware, updatePurchase);

export default router;
