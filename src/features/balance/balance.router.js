import express from "express";
import {
  createBalance,
  getAllBalances,
  getBalanceById,
} from "./balance.controller.js";

const router = express.Router();

// Routes
router.get("/all/:id", getAllBalances);
router.post("/add", createBalance);
router.get("/details/:id", getBalanceById);

export default router;
