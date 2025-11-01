import customerModel from "./customer.model.js";

// @desc    Create a new customer
// @access  Admin
export const createCustomer = async (data) => {
  const customer = new customerModel(data);
  return await customer.save();
};

// @desc    Update a customer by ID
// @access  Admin
export const updateCustomer = async (id, data) => {
  return await customerModel.findByIdAndUpdate(id, data, { new: true });
};

// @desc    Get all customers with pagination
// @access  Admin
export const getAllCustomers = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await customerModel.countDocuments();
  const customers = await customerModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    customers,
  };
};

// @desc   Get single customer by ID
// @access  Admin
export const getCustomerById = async (id) => {
  return await customerModel.findById(id);
};

// @desc Get  customers  by name, email, phone, location
// @access Admin
export const searchCustomers = async (query) => {
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

  // Find matching customers
  const customers = await customerModel.find(filter);
  return customers;
};
