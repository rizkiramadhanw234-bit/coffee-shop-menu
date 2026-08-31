import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
} from "./category.controller.js";

const router = Router();

router.get("/", findAllCategories);
router.get("/:id", findCategoryById);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
