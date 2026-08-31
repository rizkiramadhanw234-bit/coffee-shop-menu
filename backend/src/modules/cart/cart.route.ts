import {
  addToCart,
  decrementCart,
  deleteCart,
  findCarts,
} from "./cart.controller.js";
import { Router } from "express";
import { guestSession } from "../../middlewares/guest.middleware.js";

const router = Router();

router.get("/", guestSession, findCarts);
router.post("/add-to-cart", guestSession, addToCart);
router.patch("/decrement", guestSession, decrementCart);
router.delete("/delete/:id", guestSession, deleteCart);

export default router;
