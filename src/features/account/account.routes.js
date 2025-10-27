import express from "express";
import {
  createAccount,
  getAllAccounts,
  updateAccount,
} from "./account.controller.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// get all
router.get("/all", authMiddleware, getAllAccounts);

// add a account
router.post("/add", createAccount, authMiddleware);

// details view
router.put("/details/:id", updateAccount);

export default router;
