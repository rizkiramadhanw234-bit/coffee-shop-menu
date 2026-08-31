import type { Request, Response } from "express";
import * as productService from "./product.service.js";
import { ProductDto, UpdateProductDto } from "./product.dto.js";
import { AppError } from "../../utils/error.js";

export async function createProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const formBody = req.body as ProductDto;
    const imageUrl = req.file as Express.Multer.File;
    const { data } = await productService.createProduct({
      ...formBody,
      imageUrl,
    });
    res.status(201).json({ message: "product created!", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const formBody = req.body as UpdateProductDto;
    const imageUrl = req.file as Express.Multer.File;

    const { data } = await productService.updateProduct(id, {
      ...formBody,
      ...(imageUrl && { imageUrl }),
    });
    res.status(200).json({ message: "product updated!", data });
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await productService.deleteProduct(id);
    res.status(200).json({ message: "product deleted!" });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findAllProducts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const { productName, slug } = req.query as {
      productName: string;
      slug: string;
    };
    const { data, meta } = await productService.findAllProducts(
      limit,
      offset,
      productName,
      slug,
    );
    res.status(200).json({ message: "fetched all products", data, meta });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

export async function findProductById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const { data } = await productService.findProductById(id);
    res.status(200).json({ message: "fetched products by id", data });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}
