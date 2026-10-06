import type { Request, Response } from "express";
import { Interest, Skill } from "../../generated/prisma/enums.ts";
import { prisma } from "../config/db.ts";
import { ApiResponse } from "../utils/api-response.ts";

function objectFrom(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "string") return undefined;

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function enumValues<T extends string>(
  value: unknown,
  values: Record<string, T>,
): T[] | null {
  if (!Array.isArray(value)) return null;

  const result = value.filter(
    (item): item is T =>
      typeof item === "string" && Object.values(values).includes(item as T),
  );

  return result.length === value.length ? [...new Set(result)] : null;
}

function uploadedProfileImage(req: Request) {
  return req.file ? `/uploads/profile-images/${req.file.filename}` : undefined;
}

export async function saveOnboarding(req: Request, res: Response) {
  const userId = res.locals.userId as string | undefined;
  const body = req.body as Record<string, unknown>;
  const profile = objectFrom(body.profileDetails);
  const preferences = objectFrom(body.preferenceDetails);
  const area = objectFrom(body.locationDetails);

  const name = typeof profile?.name === "string" ? profile.name.trim() : "";
  const bio = typeof profile?.bio === "string" ? profile.bio.trim() : "";
  const interests = enumValues(profile?.interests, Interest);
  const skills = enumValues(profile?.skills, Skill);
  const areaLabel = area?.label;
  const longitude = area?.longitude;
  const latitude = area?.latitude;
  const localityRadius = preferences?.localityRadius;
  const localCommunityRadius = preferences?.localCommunityRadius;

  if (!userId || name.length < 2 || name.length > 50) {
    return ApiResponse.badRequest(
      res,
      "A valid name is required.",
      "INVALID_NAME",
    );
  }

  if (
    !interests ||
    interests.length === 0 ||
    !skills ||
    skills.length === 0
  ) {
    return ApiResponse.badRequest(
      res,
      "Select at least one interest and one skill.",
      "INVALID_PROFILE_PREFERENCES",
    );
  }

  if (
    typeof areaLabel !== "string" ||
    !areaLabel.trim() ||
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

  if (
    typeof localityRadius !== "number" ||
    typeof localCommunityRadius !== "number" ||
    !Number.isInteger(localityRadius) ||
    !Number.isInteger(localCommunityRadius) ||
    localityRadius < 1 ||
    localityRadius > 50 ||
    localCommunityRadius < 1 ||
    localCommunityRadius > 50
  ) {
    return ApiResponse.badRequest(
      res,
      "Search radius must be between 1 and 50 km.",
      "INVALID_RADIUS",
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        status: true,
        profile: { select: { profileImage: true } },
      },
    });

    if (!existingUser) {
      return ApiResponse.notFound(
        res,
        "User account not found.",
        "USER_NOT_FOUND",
      );
    }

    if (existingUser.status === "PENDING") {
      return ApiResponse.forbidden(
        res,
        "Please verify your email before completing onboarding.",
        "EMAIL_NOT_VERIFIED",
      );
    }

    const profileImage =
      uploadedProfileImage(req) ?? existingUser.profile?.profileImage ?? null;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        profile: {
          upsert: {
            create: {
              bio: bio || null,
              profileImage,
              interests,
              skills,
            },
            update: {
              bio: bio || null,
              profileImage,
              interests,
              skills,
            },
          },
        },
        location: {
          upsert: {
            create: {
              areaLabel: areaLabel.trim(),
              areaLongitude: longitude,
              areaLatitude: latitude,
            },
            update: {
              areaLabel: areaLabel.trim(),
              areaLongitude: longitude,
              areaLatitude: latitude,
            },
          },
        },
        preference: {
          upsert: {
            create: { localityRadius, localCommunityRadius },
            update: { localityRadius, localCommunityRadius },
          },
        },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        status: true,
        profile: true,
        location: true,
        preference: true,
      },
    });

    return ApiResponse.success(res, { user }, "Onboarding saved.");
  } catch (error) {
    console.error("Onboarding save error:", error);
    return ApiResponse.serverError(
      res,
      "Unable to save onboarding.",
      "ONBOARDING_SAVE_ERROR",
    );
  }
}
