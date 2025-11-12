import express from "express";
import {
  adjustStockController,
  createLots,
  fetchAllLots,
  fetchLotDetails,
  getAllInStockLots,
  getUnpaidAndOutOfStockLots,
  lotsBySupplier,
  updateLotStatusController,
} from "./inventoryLots.controller.js";

const router = express.Router();

// Create new lots
router.post("/add", createLots);

// get all
router.get("/all", fetchAllLots);

// get all
router.get("/by-supplier/:id", lotsBySupplier);

// get details
router.get("/details/:id", fetchLotDetails);

// change status
router.put("/status/:id", updateLotStatusController);

// get all in stock lots
router.get("/in-stock", getAllInStockLots);

router.get("/unpaid-stock-out", getUnpaidAndOutOfStockLots);

router.patch("/:lotId/adjust-stock", adjustStockController);

export default router;
