import CustomerCrateHistory from "./customerCrateHistory.model.js";

// @desc Get all crate history for a customer (status: given first)
// @access private
export const getCustomerCrateHistory = async (customerId, page, limit) => {
  const skip = (page - 1) * limit;

  const total = await CustomerCrateHistory.countDocuments({ customerId });
  const history = await CustomerCrateHistory.find({ customerId })
    .populate("customerId", "name")
    .populate("saleId", "sale_date")
    .sort({ status: 1, createdAt: -1 }) // given -> partial_return -> returned
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    history,
  };
};
// @desc Get full details of one crate history
// @access private
export const getSingleCrateHistory = async (id) => {
  return await CustomerCrateHistory.findById(id)
    .populate("customerId", "name phone")
    .populate("saleId"); // full sale details
};

// @desc Update crate return status
// @access private
export const updateCrateStatus = async (id, status) => {
  return await CustomerCrateHistory.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};
