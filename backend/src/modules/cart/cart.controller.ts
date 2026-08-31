import type { Request, Response } from "express";
import * as cartService from "./cart.service.js";
import { AppError } from "../../utils/error.js";

export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const { variantId, qty } = req.body as { variantId: string; qty: number };
    const guestId = req.guestId as string;
    const { data } = await cartService.addToCart(guestId, variantId, qty);
    res.status(201).json({ message: "added to cart", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function decrementCart(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { variantId } = req.body as { variantId: string };
    const guestId = req.guestId as string;
    const { data } = await cartService.decrementCart(variantId, guestId);
    res.status(200).json({ message: "decrement cart", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findCarts(req: Request, res: Response): Promise<void> {
  try {
    const guestId = req.guestId as string;
    const { data } = await cartService.findCarts(guestId);
    res.status(200).json({ message: "find guest carts", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteCart(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const guestId = req.guestId as string;
    await cartService.deleteCart(id, guestId);
    res.status(200).json({ message: "cart deleted" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
