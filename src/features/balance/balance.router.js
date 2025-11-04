import express from "express";
import {
  createBalance,
  getAllBalances,
  getBalanceById,
} from "./balance.controller.js";

const router = express.Router();

// Routes
router.get("/all", getAllBalances);
router.get("/details/:id", getBalanceById);
router.post("/add", createBalance);

export default router;
