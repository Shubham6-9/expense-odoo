import express from "express";
import { signupAdmin, loginAdmin, getProfile } from "../controllers/auth.controller.js";
import { checkUserExists, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signupAdmin);
router.post("/login", checkUserExists, loginAdmin);

// Protected Routes (require authentication)
router.get("/profile", verifyToken, getProfile);

export default router;
