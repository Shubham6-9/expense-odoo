// routes/user.routes.js
import express from "express";
import { createUser, adminCreateUser } from "../controllers/user.controller.js";
import {
  verifyUserToken,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

const router = express.Router();

// Company Admin creates user (uses admin auth)
router.post("/admin-create", verifyToken, adminCreateUser);

// User Admin creates user (uses user auth)
router.post("/", verifyUserToken, roleMiddleware("Admin"), createUser);

// you can also add list/update/delete endpoints here

export default router;
