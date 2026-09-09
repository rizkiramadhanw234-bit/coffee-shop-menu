import type { Request, Response } from "express";
import * as paymentService from "./payment.service.js";
import { AppError } from "../../utils/error.js";

export async function createPayment(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const guestId = req.guestId as string;
    const { orderId } = req.body as { orderId: string };
    const { data } = await paymentService.createPayment(guestId, orderId);
    res.status(201).json({ message: "payment created", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function handleNotification(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const result = await paymentService.handleNotification(req.body);
    res.status(200).json({ message: "payment webhook", result });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
