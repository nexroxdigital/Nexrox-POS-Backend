import userModel from "./user.model.js";

export async function getAllUsers(page, limit) {
  const skip = (page - 1) * limit;

  const total = await userModel.countDocuments();
  const users = await userModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    users,
  };
}

export async function getUserById(id) {
  return await User.findById(id);
}
