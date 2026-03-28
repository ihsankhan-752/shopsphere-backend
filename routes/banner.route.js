import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ensureAdminLoginMiddleware } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/multer.js";
import {
  addBanner,
  deleteBanner,
  getBanners,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  ensureAdminLoginMiddleware,
  upload.single("banner"),
  addBanner,
);

router.get("/", getBanners);

router.delete(
  "/delete/:id",
  authMiddleware,
  ensureAdminLoginMiddleware,
  deleteBanner,
);

export default router;
