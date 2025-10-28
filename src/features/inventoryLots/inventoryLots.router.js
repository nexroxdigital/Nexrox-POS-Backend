import express from "express";
import {
  createLots,
  fetchAllLots,
  fetchLotDetails,
  updateLotStatusController,
} from "./inventoryLots.controller.js";

const router = express.Router();

// Routes
router.post("/add", createLots);
router.get("/all", fetchAllLots);
router.get("/details/:id", fetchLotDetails);
router.put("/status/:id", updateLotStatusController);

export default router;
