import express from "express";
import { signin, getMe } from "../controller/AuthController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();
router.post("/login", signin);
router.get("/me", authMiddleware, getMe);

export default router;
