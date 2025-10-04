// routes/dashboard.routes.js
import express from "express";
import {
  getDashboard,
  getAdminDashboard,
  getUserDashboard,
} from "../controllers/dashboardontroler.js";
import {
  verifyToken,
  verifyUserToken,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin Dashboard (for CompanyAdmin)
router.get("/admin", verifyToken, getAdminDashboard);

// User Dashboard (for regular Users)
router.get("/user", verifyUserToken, getUserDashboard);

// Legacy route (auto-detects admin or user)
router.get("/", verifyToken, getDashboard);

export default router;
