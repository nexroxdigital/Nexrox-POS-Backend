import Supplier from "./supplier.model.js";

// Create
export const createSupplier = async (data) => {
  const supplier = new Supplier(data);
  return await supplier.save();
};

// Get all
export const getAllSuppliers = async () => {
  return await Supplier.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
};

// Get single
export const getSupplierById = async (id) => {
  return await Supplier.findById(id);
};

// update
export const updateSupplier = async (id, data) => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true });
};
