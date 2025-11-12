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

// @desc Get suppliers with due amount and support search by name, email, phone
// @access Admin
export const getDueSuppliersService = async (searchQuery = "", page, limit) => {
  const skip = (page - 1) * limit;

  const searchFilter = {};

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i"); // case-insensitive search
    searchFilter.$or = [
      { "basic_info.name": regex },
      { "contact_info.phone": regex },
      { "contact_info.email": regex },
    ];
  }

  const filter = {
    ...searchFilter,
    "account_info.due": { $gt: 0 },
  };

  const suppliers = await Supplier.find(filter)
    .select(
      "basic_info.name  basic_info.role contact_info.phone contact_info.email account_info.due"
    )
    .skip(skip)
    .limit(limit);

  const total = suppliers.length;

  return {
    suppliers,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    total,
  };
};
