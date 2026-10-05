import express from "express";
import { requireAuth } from "../middlewares/requireAuth.ts";
import { getHome, updateLocation } from "../controllers/user-controller.ts";

const homeRoutes = express.Router();

homeRoutes.get("/", requireAuth, getHome);
homeRoutes.patch("/location", requireAuth, updateLocation);

export default homeRoutes;
