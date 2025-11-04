import * as balanceService from "./balance.services.js";

// @desc    Create a new balance
// @route   POST /api/v1/balances/add
// @access  Admin or Accountant
export const createBalance = async (req, res) => {
  try {
    const balance = await balanceService.createBalance(req.body);
    res.status(201).json({
      message: "Balance created successfully",
      data: balance,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all balances
// @route   GET /api/v1/balances/all
// @access  Admin or Accountant
export const getAllBalances = async (req, res) => {
  try {
    const balances = await balanceService.getAllBalances();
    res.status(200).json({
      message: "All balances fetched successfully",
      data: balances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get balance details by ID
// @route   GET /api/v1/balances/details/:id
// @access  Admin or Accountant
export const getBalanceById = async (req, res) => {
  try {
    const balance = await balanceService.getBalanceById(req.params.id);
    if (!balance) {
      return res.status(404).json({ message: "Balance not found" });
    }
    res.status(200).json({
      message: "Balance fetched successfully",
      data: balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
