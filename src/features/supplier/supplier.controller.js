import * as supplierService from "./supplier.service.js";

// @desc    Create a new supplier
// @route   POST /api/v1/suppliers
export const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json({
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Create Supplier Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all suppliers
// @route   GET /api/v1/suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const suppliers = await supplierService.getAllSuppliers(
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Get All Suppliers Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single supplier details
// @route   GET /api/v1/suppliers/:id
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Get Supplier Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update supplier
// @route   PUT /api/v1/suppliers/:id
export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await supplierService.updateSupplier(
      req.params.id,
      req.body
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("Update Supplier Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get  suppliers  by name, email, phone, location
// @route   GET /api/v1/suppliers
// @access  Admin
export const getSuppliersByQuery = async (req, res) => {
  try {
    const suppliers = await supplierService.searchSuppliers(req.query);

    if (!suppliers.length) {
      return res.status(404).json({ message: "No suppliers found" });
    }

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get suppliers due list with optional search by name, email, phone
// @route   GET /api/v1/suppliers/due-list
// @access  Admin
export const getDueSuppliersController = async (req, res, next) => {
  try {
    const { search } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const suppliers = await supplierService.getDueSuppliersService(
      search,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      total: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};
