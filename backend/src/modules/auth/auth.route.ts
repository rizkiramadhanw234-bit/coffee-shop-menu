import { Router } from "express";
import {
  loginAdmin,
  refreshToken,
  logoutAdmin,
} from "../admin/admin.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", authMiddleware, logoutAdmin);

router.post("/refresh-token", refreshToken);

export default router;
