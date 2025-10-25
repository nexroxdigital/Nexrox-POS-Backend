import express from "express";
import {
  createCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
} from "./customer.controller.js";

const router = express.Router();

router.post("/add", createCustomer);
router.put("/update/:id", updateCustomer);
router.get("/all", getAllCustomers);
router.get("/details/:id", getCustomerById);

export default router;
