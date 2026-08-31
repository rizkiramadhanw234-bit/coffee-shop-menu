import { Router } from "express";
import {
  findAllVariants,
  createVariant,
  deleteVariant,
  findVariantById,
  updateVariant,
} from "./variant.controller.js";

const router = Router();

router.get("/", findAllVariants);
router.get("/:id", findVariantById);
router.post("/create", createVariant);
router.put("/update/:id", updateVariant);
router.delete("/delete/:id", deleteVariant);

export default router;
