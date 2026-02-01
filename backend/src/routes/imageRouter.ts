import express from "express";
import {
  createImage,
  getImages,
  updateImageStatus,
  deleteImage
} from "../controllers/imageController";
// import { requireAuth } from "../middleware/auth.ts";

export const router = express.Router();

// user upload
router.post("/", createImage);

// gallery & admin fetch
router.get("/", getImages);

// admin only
router.patch("/:id", updateImageStatus);
router.delete("/:id", deleteImage);
