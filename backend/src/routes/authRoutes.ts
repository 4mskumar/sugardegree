import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/authController";

export const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
