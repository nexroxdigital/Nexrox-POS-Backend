import Supplier from "./supplier.model.js";

// Create
export const createSupplier = async (data) => {
  const supplier = new Supplier(data);
  return await supplier.save();
};

// Get all
export const getAllSuppliers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Supplier.countDocuments();
  const suppliers = await Supplier.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    suppliers,
  };
};

// Get single
export const getSupplierById = async (id) => {
  return await Supplier.findById(id);
};

// update
export const updateSupplier = async (id, data) => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true });
};
