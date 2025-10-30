import express from "express";
import * as saleController from "./sale.controller.js";

const router = express.Router();

// add sale
router.post("/add", saleController.createSale);

// get all
router.get("/all", saleController.getAllSales);

// get details
router.get("/details/:id", saleController.getSaleById);

export default router;
