import express from "express";
import {
  createCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
} from "./customer.controller.js";

const router = express.Router();

// add new customer
router.post("/add", createCustomer);

// update customer
router.put("/update/:id", updateCustomer);

// get all customer
router.get("/all", getAllCustomers);

// get details view
router.get("/details/:id", getCustomerById);

export default router;
