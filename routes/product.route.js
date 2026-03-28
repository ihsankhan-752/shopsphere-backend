import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller.js";

import { upload } from "../middlewares/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ensureAdminLoginMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  ensureAdminLoginMiddleware,
  upload.single("image"),
  addProduct,
);

router.get("/", getAllProducts);

router.delete(
  "/delete/:id",
  authMiddleware,
  ensureAdminLoginMiddleware,
  deleteProduct,
);

export default router;
