import express from "express";
import {
  createCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomersByQuery,
  getDueCustomersController,
} from "./customer.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", getCustomersByQuery);

// add new customer
router.post("/add", authMiddleware, createCustomer);

// update customer
router.put("/update/:id", authMiddleware, updateCustomer);

// get all customer
router.get("/all", getAllCustomers);

// get details view
router.get("/details/:id", getCustomerById);

// GET due-list
router.get("/due-list", getDueCustomersController);

export default router;
