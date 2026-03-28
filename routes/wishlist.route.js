import express from "express";
import {
  addProductToWishlist,
  deleteProductFromWishlist,
  getWishlistProduct,
} from "../controllers/wishlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/addToWishlist", authMiddleware, addProductToWishlist);
router.get("/", authMiddleware, getWishlistProduct);
router.delete("/delete/:id", authMiddleware, deleteProductFromWishlist);

export default router;
