import express from "express";
import {
  getAllActivityLogs,
  getActivityLogById,
} from "./activityLog.controller.js";

const router = express.Router();

// Get all activity logs
// GET /api/v1/activity-logs
router.get("/all", getAllActivityLogs);

// Get single activity log by ID
// GET /api/v1/activity-logs/:id
router.get("/details/:id", getActivityLogById);

export default router;
