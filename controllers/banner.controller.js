import db from "../db/index.js";
import { bannerTable } from "../db/schema/banner.schema.js";

import cloudinary from "../db/config/cloudinary.js";
import { eq } from "drizzle-orm";

export const addBanner = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "No Image Selected" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "banners",
    });

    const [banner] = await db
      .insert(bannerTable)
      .values({
        image: result.secure_url,
      })
      .returning();

    return res.status(201).json({
      message: "Banner Added",
      data: banner,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Failed to add Banner` });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await db.select().from(bannerTable);
    return res.status(200).json({ data: banners });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to get banners" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const deletedBanner = await db
      .delete(bannerTable)
      .where(eq(bannerTable.id, bannerId))
      .returning();

    if (deletedBanner.length === 0) {
      return res.status(400).json({ error: "No Banner Found" });
    }

    return res.status(200).json({ message: "Banner Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to Delete Banner" });
  }
};
