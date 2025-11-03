import Balance from "./balance.model.js";

// @desc    Create a new balance
// @access  Admin
export const createBalance = async (data) => {
  const balance = new Balance(data);
  return await balance.save();
};

// @desc    Get all balances
// @access  Admin or Accountant
export const getAllBalances = async () => {
  return await Balance.find().sort({ createdAt: -1 });
};

// @desc    Get balance details by ID
// @access  Admin or Accountant
export const getBalanceById = async (id) => {
  return await Balance.findById(id);
};
