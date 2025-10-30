import express from "express";
import {
  checkDuplicateLotName,
  createLots,
  fetchAllLots,
  fetchLotDetails,
  getAllInStockLots,
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

// check lots name
// todo : talk to neyanmt bhai and remove
router.get("/check-name", checkDuplicateLotName);

// get all in stock lots
router.get("/in-stock", getAllInStockLots);

export default router;
