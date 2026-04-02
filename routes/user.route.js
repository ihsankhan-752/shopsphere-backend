import express from "express";

import {
  userSignUp,
  userLogin,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
