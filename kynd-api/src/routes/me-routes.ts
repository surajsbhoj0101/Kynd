import express from "express";
import { requireAuth } from "../middlewares/requireAuth.ts";
import {
  getMe,
  getMyPosts,
  updateLocation,
} from "../controllers/me-controller.ts";

const meRoutes = express.Router();

meRoutes.get("/", requireAuth, getMe);
meRoutes.get("/me", requireAuth, getMe);
meRoutes.get("/me/myposts", requireAuth, getMyPosts);
meRoutes.patch("/location", requireAuth, updateLocation);

export default meRoutes;
