import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getAllOrdersAsAdmin,
  getOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { ensureAdminLoginMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);

router.get(
  "/admin",
  authMiddleware,
  ensureAdminLoginMiddleware,
  getAllOrdersAsAdmin,
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  ensureAdminLoginMiddleware,
  updateOrderStatus,
);

router.get("/", authMiddleware, getOrders);

export default router;
