import { Router } from "express";
import { createPost } from "../controllers/post-controllers.ts";
import { uploadPostImages } from "../config/upload.ts";
import { requireAuth } from "../middlewares/requireAuth.ts";

const postRoutes = Router();

postRoutes.post(
  "/",
  requireAuth,
  uploadPostImages.array("images", 8),
  createPost,
);

export default postRoutes;
