import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getDueSuppliersController,
  getSupplierById,
  getSuppliersByQuery,
  updateSupplier,
} from "./supplier.controller.js";

const router = express.Router();

router.get("/", getSuppliersByQuery);

// add suppliers
router.post("/add", createSupplier);

// add get all
router.get("/all", getAllSuppliers);

// get details view
router.get("/details/:id", getSupplierById);

// update
router.put("/update/:id", updateSupplier);

// GET due-list
router.get("/due-list", getDueSuppliersController);

export default router;
