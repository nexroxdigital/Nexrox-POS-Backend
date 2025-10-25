import { logActivity } from "../../utils/activityLogger.js";
import * as customerService from "./customer.services.js";

// @desc    Create a new customer
// @route   POST /api/v1/customers
// @access  Admin
export const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);

    // Log activity
    await logActivity({
      model_name: "Customer",
      logs_fields_id: customer._id,
      by: "68f4d6cac4fc8e34b086a0a8", //! req.user._id,
      action: "Created",
      note: "New customer created",
    });

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.log(error, "creating customer");
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing customer
// @route   PUT /api/v1/customers/:id
// @access  Admin
export const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id,
      req.body
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Log activity
    await logActivity({
      model_name: "Customer",
      logs_fields_id: customer._id,
      // by: req.user._id,
      action: "Updated",
      note: "Customer information updated",
    });

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all customers with pagination
// @route   GET /api/v1/customers
// @access  Admin
export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const customers = await customerService.getAllCustomers(
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer details by ID
// @route   GET /api/v1/customers/:id
// @access  Admin
export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
