import { Router } from "express";
import {
  findOrders,
  cancelOrder,
  createOrder,
  deleteOrder,
  findAllOrders,
  deleteOrderAdmin,
  updateStatusOrder,
  findOrderById,
  updatePaymentStatus,
} from "./order.controller.js";
import { guestSession } from "../../middlewares/guest.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/", guestSession, findOrders);
router.post("/create", guestSession, createOrder);
router.patch("/cancel/:id", guestSession, cancelOrder);
router.delete("/delete/:id", guestSession, deleteOrder);

// admin
router.get("/all", authMiddleware, isAdmin, findAllOrders);
router.get("/:id", authMiddleware, isAdmin, findOrderById);
router.patch(
  "/order-update-status/:id",
  authMiddleware,
  isAdmin,
  updateStatusOrder,
);
router.patch(
  "/payment-update-status/:id",
  authMiddleware,
  isAdmin,
  updatePaymentStatus,
);
router.delete("/delete-order/:id", authMiddleware, deleteOrderAdmin);

export default router;
