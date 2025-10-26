import express from "express";
import {
  createAccount,
  getAllAccounts,
  updateAccount,
} from "./account.controller.js";

const router = express.Router();

// add a account
router.post("/add", createAccount);

// get all
router.get("/all", getAllAccounts);

// details view
router.put("/details/:id", updateAccount);

export default router;
