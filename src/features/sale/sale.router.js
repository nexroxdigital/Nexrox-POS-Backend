import express from "express";
import {
  createSale,
  getAllSales,
  getSaleById,
  salesByCustomer,
} from "./sale.controller.js";

const router = express.Router();

// add sale
router.post("/add", createSale);

// get all
router.get("/all", getAllSales);

// get all sales by customer
router.get("/by-customer/:id", salesByCustomer);

// get details
router.get("/details/:id", getSaleById);

export default router;
