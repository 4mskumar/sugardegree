import express from "express";
import {
  createImage,
  getImages,
  getPublicImages,
  updateImageStatus,
  updateVisibility,
  deleteImage,
} from "../controllers/imageController";

export const router = express.Router();

// user upload
router.post("/", createImage);

// admin fetch by status
router.get("/", getImages); // ?status=pending|approved|rejected

// public gallery
router.get("/public", getPublicImages);

// admin actions
router.patch("/:id", updateImageStatus);
router.patch("/:id/visibility", updateVisibility);
router.delete("/:id", deleteImage);
