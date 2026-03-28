import express from "express";
import { upload } from "../middlewares/multer.js";
import cloudinary from "../db/config/cloudinary.js";
const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64Image = req.file.buffer.toString("base64"); 

    const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "uploads",
    });

    res.json({
      message: "Uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to Upload " });
  }
});

export default router;
