import type { Request, Response } from "express";
import * as orderService from "./order.service.js";
import { AppError } from "../../utils/error.js";
import { getIO } from "../../socket/index.js";
import { SocketRoom, SocketEvents } from "../../types/socket.type.js";
export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { cartId, customerName, tableNo } = req.body as {
      cartId: string;
      customerName: string;
      tableNo: number;
    };
    const guestId = req.guestId as string;
    const { data } = await orderService.createOrder(
      guestId,
      cartId,
      customerName,
      tableNo,
    );

    getIO().to(SocketRoom.staff).emit(SocketEvents.newOrder, data);
    res.status(201).json({ message: "order created", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function cancelOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const guestId = req.guestId as string;
    await orderService.cancelOrder(id, guestId);
    res.status(200).json({ message: "order cancelled" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const guestId = req.guestId as string;
    await orderService.deleteOrder(id, guestId);
    res.status(200).json({ message: "order deleted" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findOrders(req: Request, res: Response): Promise<void> {
  try {
    const guestId = req.guestId as string;
    const { data } = await orderService.findOrders(guestId);
    res.status(200).json({ message: "find guest orders", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

// admin access
export async function findPendingOrders(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const { data, meta } = await orderService.findPendingOrders(limit, offset);
    res.status(200).json({ message: "find pending orders", data, meta });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findAllOrders(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const { data, meta } = await orderService.findAllOrders(limit, offset);
    res.status(200).json({ message: "find all orders", data, meta });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function updateStatusOrder(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { statusOrder } = req.body as { statusOrder: string };
    const { data } = await orderService.updateStatusOrder(id, statusOrder);
    res.status(200).json({ message: "updated status order", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteOrderAdmin(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await orderService.deleteOrderAdmin(id);
    res.status(200).json({ message: "deleted order by admin" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
