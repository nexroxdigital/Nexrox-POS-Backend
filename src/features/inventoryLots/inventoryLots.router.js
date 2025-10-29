import express from "express";
import {
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

// todo :- check lots name

export default router;
