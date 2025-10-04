import express from "express";
import {
  signupAdmin,
  loginAdmin,
  getProfile,
  loginUser,
} from "../controllers/auth.controller.js";
import {
  checkUserExists,
  verifyToken,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/admin/signup", signupAdmin);
router.post("/admin/login", checkUserExists, loginAdmin);
router.post("/user/login", loginUser);

// Protected Routes (require authentication)
router.get("/admin/profile", verifyToken, getProfile);

export default router;
