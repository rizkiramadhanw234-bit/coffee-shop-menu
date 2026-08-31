import type { Request, Response } from "express";
import * as categoryService from "./category.service.js";
import { AppError } from "../../utils/error.js";

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name } = req.body as { name: string };
    const { data } = await categoryService.createCategory(name);
    res.status(201).json({ message: "Category created!", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { name } = req.body as { name: string };
    const { data } = await categoryService.updateCategory(id, name);
    res.status(200).json({ message: "category updated!", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await categoryService.deleteCategory(id);
    res.status(200).json({ message: "category deleted!" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findAllCategories(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { data } = await categoryService.findAllCategories();
    res.status(200).json({ message: "all category fetched!", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findCategoryById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { data } = await categoryService.findCategoryById(id);
    res.status(200).json({ message: "category by id fetched!", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
