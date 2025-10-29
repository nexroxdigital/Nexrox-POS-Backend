import express from "express";
import {
  checkDuplicateLotName,
  createLots,
  fetchAllLots,
  fetchLotDetails,
  updateLotStatusController,
} from "./inventoryLots.controller.js";

const router = express.Router();

// Create new lots
router.post("/add", createLots);

// get all
router.get("/all", fetchAllLots);

// get details
router.get("/details/:id", fetchLotDetails);

// change status
router.put("/status/:id", updateLotStatusController);

// check lots name
router.get("/check-name", checkDuplicateLotName);
export default router;
