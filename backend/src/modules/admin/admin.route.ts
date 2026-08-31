import { Router } from "express";
import {
  findAdminById,
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "./admin.controller.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id", authMiddleware, isAdmin, findAdminById);
router.post("/auth/login", loginAdmin);
router.post("/auth/logout", authMiddleware, logoutAdmin);

router.post("/refresh-token", refreshToken);

export default router;
