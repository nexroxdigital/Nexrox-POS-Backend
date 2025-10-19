import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.service.js";

export async function getAll(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getById(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function create(req, res) {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function update(req, res) {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function remove(req, res) {
  try {
    const deletedUser = await deleteUser(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
