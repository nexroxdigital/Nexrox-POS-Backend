import express from "express";
import {
  addCratesForSupplier,
  createCrateTransition,
  getAllCrateTransitions,
  updateCrateOrSupplierController,
} from "./inventoryCrate.controller.js";

const router = express.Router();

// Routes

router.post("/add", createCrateTransition);

router.get("/all", getAllCrateTransitions);

router.post("/sent-to-supplier/:supplierId", addCratesForSupplier);

router.patch("/update/", updateCrateOrSupplierController);

export default router;
