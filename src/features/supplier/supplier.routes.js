import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "./supplier.controller.js";

const router = express.Router();

// add suppliers
router.post("/add", createSupplier);

// add get all
router.get("/all", getAllSuppliers);

// get details view
router.get("/details/:id", getSupplierById);

// update
router.put("/update/:id", updateSupplier);

export default router;
