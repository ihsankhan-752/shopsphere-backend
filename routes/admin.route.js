import express from "express";

import {
  adminLoginController,
  adminSignUpController,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/signup", adminSignUpController);
router.post("/login", adminLoginController);

export default router;
