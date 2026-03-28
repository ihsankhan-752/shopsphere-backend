import express from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create-intent", authMiddleware, createPaymentIntent);

export default router;
