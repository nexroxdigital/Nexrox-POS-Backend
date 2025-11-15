import express from "express";
import { getDashboardStats } from "./analysis.controller.js";

const router = express.Router();

// Routes
router.get("/stats", getDashboardStats);

export default router;
