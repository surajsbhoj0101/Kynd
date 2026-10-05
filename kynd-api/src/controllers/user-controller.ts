import { ApiResponse } from "../utils/api-response.ts";
import { Request, Response } from "express";
import { prisma } from "../config/db.ts";

export const getHome = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string | undefined;

    if (!userId) {
      return ApiResponse.badRequest(
        res,
        "User ID is required.",
        "MISSING_USER_ID",
      );
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        status: true,
        profile: { select: { bio: true, profileImage: true } },
        location: { select: { areaLabel: true } },
        createdAt: true,
      },
    });

    if (!userDetails) {
      return ApiResponse.notFound(
        res,
        "User account not found.",
        "USER_NOT_FOUND",
      );
    }

    return ApiResponse.success(res, userDetails);
  } catch (error) {
    console.error("Error fetching home data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string | undefined;
    const { label, longitude, latitude } = req.body as Record<string, unknown>;

    if (
      !userId ||
      typeof label !== "string" ||
      !label.trim() ||
      typeof longitude !== "number" ||
      typeof latitude !== "number" ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return ApiResponse.badRequest(
        res,
        "A valid location is required.",
        "INVALID_LOCATION",
      );
    }

    const location = await prisma.userLocation.upsert({
      where: { userId },
      create: {
        userId,
        areaLabel: label.trim(),
        areaLongitude: longitude,
        areaLatitude: latitude,
      },
      update: {
        areaLabel: label.trim(),
        areaLongitude: longitude,
        areaLatitude: latitude,
      },
    });

    return ApiResponse.success(res, { location }, "Location updated.");
  } catch (error) {
    console.error("Error updating user location:", error);
    return ApiResponse.serverError(
      res,
      "Unable to update your location.",
      "LOCATION_UPDATE_ERROR",
    );
  }
};
