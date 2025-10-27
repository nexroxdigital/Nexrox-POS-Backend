import Account from "./account.model.js";

// Create account
export const createAccount = async (data) => {
  const account = new Account(data);
  return await account.save();
};

// Get all accounts
export const getAllAccounts = async (page, limit) => {
  const skip = (page - 1) * limit;
  const total = await Account.countDocuments();

  const accounts = await Account.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    accounts,
  };
};

// Update account
export const updateAccount = async (id, data) => {
  return await Account.findByIdAndUpdate(id, data, { new: true });
};
