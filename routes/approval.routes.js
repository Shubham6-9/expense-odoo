// routes/approval.routes.js
import express from "express";
import {
  createApprovalRule,
  listApprovalRules,
  getApprovalRule,
  updateApprovalRule,
  deleteApprovalRule,
} from "../controllers/approval.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (for now)
router.get("/", listApprovalRules);
router.get("/:id", getApprovalRule);

// Admin-only routes
router.post("/", verifyToken, createApprovalRule);
router.patch("/:id", verifyToken, updateApprovalRule);
router.delete("/:id", verifyToken, deleteApprovalRule);

export default router;
