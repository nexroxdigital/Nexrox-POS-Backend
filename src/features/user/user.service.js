import userModel from "./user.model.js";

export async function getAllUsers() {
  return await userModel.find();
}

export async function getUserById(id) {
  return await User.findById(id);
}

export async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

export async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}
