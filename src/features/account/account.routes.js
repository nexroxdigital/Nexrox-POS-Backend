import express from "express";
import {
  createAccount,
  getAllAccounts,
  updateAccount,
} from "./account.controller.js";

const router = express.Router();

// get all
router.get("/all", getAllAccounts);

// add a account
router.post("/add", createAccount);

// details view
router.put("/details/:id", updateAccount);

export default router;
