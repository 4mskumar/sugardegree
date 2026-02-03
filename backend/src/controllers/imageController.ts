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
      status: "pending",
      visible: true,
    });

    console.log(image);
    

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Failed to create image" });
  }
};

// Get images by status (admin)
export const getImages = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;

    const filter: any = {};
    if (status) filter.status = status;

    const images = await Image.find(filter).sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

// Public gallery (only approved & visible)
export const getPublicImages = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const images = await Image.find({
      status: "approved",
      visible: true,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch public images" });
  }
};


// Approve or reject image
export const updateImageStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

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

// Toggle visibility
export const updateVisibility = async (req: Request, res: Response) => {
  try {
    const { visible } = req.body;
    const { id } = req.params;

    const image = await Image.findByIdAndUpdate(
      id,
      { visible },
      { new: true }
    );

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Failed to update visibility" });
  }
};

// Delete image
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Image.findByIdAndDelete(id);

    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};
