import express from "express";
import {
  addAddress,
  deleteAddress,
  myAddresses,
} from "../controllers/address.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", authMiddleware, addAddress);
router.get("/", authMiddleware, myAddresses);
router.delete("/delete/:id", authMiddleware, deleteAddress);
router.put("/update/:id", authMiddleware, deleteAddress);

export default router;
