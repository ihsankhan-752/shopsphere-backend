import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ensureAdminLoginMiddleware } from "../middlewares/admin.middleware.js";
import {
  addNewCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categories.controller.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  ensureAdminLoginMiddleware,
  addNewCategory,
);

router.get("/", getAllCategories);

router.delete(
  "/delete/:id",
  authMiddleware,
  ensureAdminLoginMiddleware,
  deleteCategory,
);

router.patch(
  "/update/:id",
  authMiddleware,
  ensureAdminLoginMiddleware,
  updateCategory,
);

export default router;
