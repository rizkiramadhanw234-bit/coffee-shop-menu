import { Router } from "express";
import { createPayment, handleNotification } from "./payment.controller.js";
import { guestSession } from "../../middlewares/guest.middleware.js";

const router = Router();

router.post("/create", guestSession, createPayment);
router.post("/notification", handleNotification);

export default router;
