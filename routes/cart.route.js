import express from "express";
import {
  addProductToCart,
  getAllProductFromCart,
  updateCart,
  deleteProductFromCart,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/addProduct", authMiddleware, addProductToCart);
router.get("/", authMiddleware, getAllProductFromCart);
router.put("/update", authMiddleware, updateCart);
router.delete("/delete/:id", authMiddleware, deleteProductFromCart);

export default router;
