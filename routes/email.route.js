import express from "express";
import { sendOrderStatusEmail } from "../services/email.services.js";

const router = express.Router();

router.post("/sendEmail", sendOrderStatusEmail);

export default router;
