import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  updateProduct,
} from "./product.controller.js";
import { uploadCoverImage } from "../../middlewares/upload.middleware.js";

const router = Router();

router.get("/", findAllProducts);
router.get("/:id", findProductById);
router.post("/create", uploadCoverImage.single("imageUrl"), createProduct);
router.put("/update/:id", uploadCoverImage.single("imageUrl"), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
