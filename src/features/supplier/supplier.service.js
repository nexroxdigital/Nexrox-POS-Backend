import Supplier from "./supplier.model.js";

// @desc create new suppliers
// @access Admin
export const createSupplier = async (data) => {
  const supplier = new Supplier(data);
  return await supplier.save();
};

// @desc Get  all supplier
// @access Admin
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

// @desc Get  single supplier information
// @access Admin
export const getSupplierById = async (id) => {
  return await Supplier.findById(id);
};

// @desc update suppliers information
// @access Admin
export const updateSupplier = async (id, data) => {
  return await Supplier.findByIdAndUpdate(id, data, { new: true });
};

// @desc Get  suppliers  by name, email, phone, location
// @access Admin
export const searchSuppliers = async (query) => {
  const { name, email, phone, location } = query;

  // Build dynamic filter
  const filter = {};

  if (name) {
    filter["basic_info.name"] = { $regex: name, $options: "i" };
  }

  if (email) {
    filter["contact_info.email"] = { $regex: email, $options: "i" };
  }

  if (phone) {
    filter["contact_info.phone"] = { $regex: phone, $options: "i" };
  }

  if (location) {
    filter["contact_info.location"] = { $regex: location, $options: "i" };
  }

  // Find matching suppliers
  const suppliers = await Supplier.find(filter);
  return suppliers;
};
