import type { Request, Response } from "express";
import * as variantService from "./variant.service.js";
import type { VariantDto, UpdateVariantDto } from "./variant.dto.js";
import { AppError } from "../../utils/error.js";

export async function createVariant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const formBody = req.body as VariantDto;
    const { data } = await variantService.createVariant(formBody);
    res.status(201).json({ message: "variant created", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function updateVariant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const formBody = req.body as UpdateVariantDto;
    const { data } = await variantService.updateVariant(id, formBody);
    res.status(200).json({ message: "variant updated", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteVariant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await variantService.deleteVariant(id);
    res.status(200).json({ message: "variant deleted" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findAllVariants(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { data } = await variantService.findAllVariants();
    res.status(200).json({ message: "fetched all variants", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findVariantById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { data } = await variantService.findVariantById(id);
    res.status(200).json({ message: "fetched variant by id", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
