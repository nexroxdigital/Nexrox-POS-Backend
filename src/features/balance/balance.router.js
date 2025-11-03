import express from "express";
import {
  createBalance,
  getAllBalances,
  getBalanceById,
} from "./balance.controller.js";

const router = express.Router();

// Routes
router.get("/all", createBalance);
router.get("/details/:id", getAllBalances);
router.post("/add", getBalanceById);

export default router;
