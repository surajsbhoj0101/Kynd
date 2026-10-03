import type { Request, Response } from "express";
import {
  DayOfWeek,
  OfferingHelpIntent,
  UserIntent,
} from "../../generated/prisma/enums.ts";
import { prisma } from "../config/db.ts";
import { ApiResponse } from "../utils/api-response.ts";

const intentMap: Record<string, UserIntent> = {
  looking_for_help: UserIntent.LOOKING_FOR_HELP,
  offering_help: UserIntent.OFFERING_HELP,
  contribute: UserIntent.CONTRIBUTE,
  organize: UserIntent.ORGANIZE,
  just_browsing: UserIntent.JUST_BROWSING,
};

const offerMap: Record<string, OfferingHelpIntent> = {
  food: OfferingHelpIntent.FOOD,
  transportation: OfferingHelpIntent.TRANSPORTATION,
  childcare: OfferingHelpIntent.CHILDCARE,
  petcare: OfferingHelpIntent.PETCARE,
  mental_health_support: OfferingHelpIntent.MENTAL_HEALTH,
  financial_support: OfferingHelpIntent.FINANCIAL_ASSISTANCE,
  educational_support: OfferingHelpIntent.EDUCATION,
  legal_support: OfferingHelpIntent.LEGAL_ASSISTANCE,
  technical_support: OfferingHelpIntent.TECHNICAL_SUPPORT,
  other: OfferingHelpIntent.OTHER,
};

const dayMap: Record<string, DayOfWeek> = {
  sunday: DayOfWeek.SUNDAY,
  monday: DayOfWeek.MONDAY,
  tuesday: DayOfWeek.TUESDAY,
  wednesday: DayOfWeek.WEDNESDAY,
  thursday: DayOfWeek.THURSDAY,
  friday: DayOfWeek.FRIDAY,
  saturday: DayOfWeek.SATURDAY,
};

function valuesFrom<T>(value: unknown, map: Record<string, T>) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const values = value.map((item) =>
    typeof item === "string" ? map[item] : undefined,
  );
  return values.every(Boolean) ? (values as T[]) : null;
}

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

function uploadedProfileImage(req: Request) {
  return req.file ? `/uploads/profile-images/${req.file.filename}` : undefined;
}

export async function saveOnboarding(req: Request, res: Response) {
  const userId = res.locals.userId as string | undefined;
  const body = req.body as Record<string, unknown>;
  const profile = objectFrom(body.profileDetails);
  const intent = objectFrom(body.intentDetails);
  const availability = objectFrom(body.availabilityDetails);
  const area = availability?.area as Record<string, unknown> | undefined;

  const name = typeof profile?.name === "string" ? profile.name.trim() : "";
  const bio = typeof profile?.bio === "string" ? profile.bio.trim() : "";
  const intents = valuesFrom(intent?.intent, intentMap);
  const offers = valuesFrom(intent?.offer, offerMap);
  const days = valuesFrom(availability?.availabilityDay, dayMap);
  const availabilityTime = availability?.availabilityTime;
  const areaLabel = area?.label;
  const longitude = area?.longitude;
  const latitude = area?.latitude;
  const personalHelpRadius =
    typeof availability?.personalHelpRadius === "number"
      ? availability.personalHelpRadius
      : null;
  const communityHelpRadius =
    typeof availability?.communityHelpRadius === "number"
      ? availability.communityHelpRadius
      : null;

  if (!userId || name.length < 2 || name.length > 50) {
    return ApiResponse.badRequest(
      res,
      "A valid name is required.",
      "INVALID_NAME",
    );
  }
  if (bio.length > 240 || !intents || !offers || !days || days.length === 0) {
    return ApiResponse.badRequest(
      res,
      "Invalid onboarding preferences.",
      "INVALID_PREFERENCES",
    );
  }
  if (
    typeof availabilityTime !== "string" ||
    typeof areaLabel !== "string" ||
    !areaLabel.trim()
  ) {
    return ApiResponse.badRequest(
      res,
      "Area and availability time are required.",
      "INVALID_AVAILABILITY",
    );
  }
  if (
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
      "Valid location coordinates are required.",
      "INVALID_LOCATION",
    );
  }
  if (
    personalHelpRadius === null ||
    communityHelpRadius === null ||
    !Number.isInteger(personalHelpRadius) ||
    !Number.isInteger(communityHelpRadius) ||
    personalHelpRadius < 1 ||
    personalHelpRadius > 50 ||
    communityHelpRadius < 1 ||
    communityHelpRadius > 50
  ) {
    return ApiResponse.badRequest(
      res,
      "Help radius must be between 1 and 50 km.",
      "INVALID_RADIUS",
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImage: true, status: true },
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
      uploadedProfileImage(req) ?? existingUser?.profileImage ?? null;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio: bio || null,
        profileImage,
        intent: intents,
        offeringHelpIntent: offers,
        dayOfWeekAvailability: days,
        availabilityTime,
        areaLabel: areaLabel.trim(),
        areaLongitude: longitude,
        areaLatitude: latitude,
        personalHelpRadius,
        communityHelpRadius,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        bio: true,
        profileImage: true,
        intent: true,
        offeringHelpIntent: true,
        dayOfWeekAvailability: true,
        availabilityTime: true,
        areaLabel: true,
        areaLongitude: true,
        areaLatitude: true,
        personalHelpRadius: true,
        communityHelpRadius: true,
        status: true,
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
