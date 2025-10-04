// routes/dashboard.routes.js
import express from "express";
import getDashboard from "../controllers/dashboardontroler.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getDashboard);

export default router;
