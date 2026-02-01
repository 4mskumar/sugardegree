import { Request, Response } from "express";
import { Image } from "../models/image";

// Create new image (user upload)
export const createImage = async (req: Request, res: Response) => {
  try {
    const { title, tags, imageUrl } = req.body;

    const image = await Image.create({
      title,
      tags,
      imageUrl,
      status: "pending"
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Failed to create image" });
  }
};

// Get images by status
export const getImages = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;

    const images = await Image.find(
      status ? { status } : {}
    ).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

// Approve or reject image (admin)
export const updateImageStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const image = await Image.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Failed to update image" });
  }
};

// Delete image (admin)
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Image.findByIdAndDelete(id);

    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};
