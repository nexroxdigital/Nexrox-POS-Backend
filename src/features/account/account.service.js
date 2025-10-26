import Account from "./account.model.js";

// Create account
export const createAccount = async (data) => {
  const account = new Account(data);
  return await account.save();
};

// Get all accounts
export const getAllAccounts = async (skip, limit) => {
  return await Account.find()
    .sort({ createdAt: -1 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Update account
export const updateAccount = async (id, data) => {
  return await Account.findByIdAndUpdate(id, data, { new: true });
};
