import type { Request, Response } from "express";
import { PostType, ScheduleType } from "../../generated/prisma/enums.ts";
import { prisma } from "../config/db.ts";
import { ApiResponse } from "../utils/api-response.ts";

type UploadedImage = Express.Multer.File;

function isPostType(value: unknown): value is PostType {
  return typeof value === "string" && Object.values(PostType).includes(value as PostType);
}

function isScheduleType(value: unknown): value is ScheduleType {
  return (
    typeof value === "string" &&
    Object.values(ScheduleType).includes(value as ScheduleType)
  );
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string | undefined;
    if (!userId) {
      return ApiResponse.unauthorized(res, "Authentication required.", "AUTH_REQUIRED");
    }

    const body = req.body as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const postType = body.postType;
    const scheduleType = body.scheduleType;
    const locationLabel =
      typeof body.locationLabel === "string" ? body.locationLabel.trim() : undefined;
    const locationLongitude = parseNumber(body.locationLongitude);
    const locationLatitude = parseNumber(body.locationLatitude);
    const scheduleStartDate = parseDate(body.scheduleStartDate);
    const scheduleEndDate = parseDate(body.scheduleEndDate);

    if (!title || title.length > 120) {
      return ApiResponse.badRequest(res, "Title is required and must be 120 characters or fewer.", "INVALID_TITLE");
    }
    if (!content || content.length > 2000) {
      return ApiResponse.badRequest(res, "Content is required and must be 2000 characters or fewer.", "INVALID_CONTENT");
    }
    if (!isPostType(postType)) {
      return ApiResponse.badRequest(res, "A valid post type is required.", "INVALID_POST_TYPE");
    }
    if (scheduleType !== undefined && !isScheduleType(scheduleType)) {
      return ApiResponse.badRequest(res, "Invalid schedule type.", "INVALID_SCHEDULE_TYPE");
    }
    if (scheduleStartDate === undefined && body.scheduleStartDate) {
      return ApiResponse.badRequest(res, "Invalid schedule start date.", "INVALID_SCHEDULE_START");
    }
    if (scheduleEndDate === undefined && body.scheduleEndDate) {
      return ApiResponse.badRequest(res, "Invalid schedule end date.", "INVALID_SCHEDULE_END");
    }
    if (scheduleEndDate && scheduleStartDate && scheduleEndDate <= scheduleStartDate) {
      return ApiResponse.badRequest(res, "Schedule end must be after the start.", "INVALID_SCHEDULE_RANGE");
    }
    if (locationLongitude !== undefined && (locationLongitude < -180 || locationLongitude > 180)) {
      return ApiResponse.badRequest(res, "Invalid location longitude.", "INVALID_LOCATION");
    }
    if (locationLatitude !== undefined && (locationLatitude < -90 || locationLatitude > 90)) {
      return ApiResponse.badRequest(res, "Invalid location latitude.", "INVALID_LOCATION");
    }

    const files = (req.files as UploadedImage[] | undefined) ?? [];
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        type: postType,
        title,
        content,
        locationLabel: locationLabel || null,
        locationLongitude: locationLongitude ?? null,
        locationLatitude: locationLatitude ?? null,
        ...(files.length > 0 && {
          images: {
            create: files.map((file, index) => ({
              url: `/uploads/post-images/${file.filename}`,
              sortOrder: index,
            })),
          },
        }),
        ...(scheduleType && {
          schedule: {
            create: {
              type: scheduleType,
              startsAt: scheduleStartDate ?? null,
              endsAt: scheduleEndDate ?? null,
            },
          },
        }),
      },
      include: { images: true, schedule: true },
    });

    return ApiResponse.success(res, { post }, "Post created successfully.", 201);
  } catch (error) {
    console.error("Error creating post:", error);
    return ApiResponse.serverError(res, "Unable to create post.", "CREATE_POST_ERROR");
  }
};
