import express from "express";
import { create, getAll, getById, remove, update } from "./user.controller.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);

router.get("/:id", getById);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;
