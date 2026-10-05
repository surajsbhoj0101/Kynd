import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { ApiResponse } from "../utils/api-response.ts";
import { verifyToken } from "../utils/jwt.ts";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const accessToken = req.cookies?.access_token;
    const accessJwtSecret = process.env.ACCESS_JWT_SECRET;

    if (!accessToken || !accessJwtSecret) {
      return ApiResponse.unauthorized(
        res,
        "Authentication required.",
        "AUTH_REQUIRED",
      );
    }

    const payload = await verifyToken(accessToken, {
      secret: accessJwtSecret,
      issuer: "kynd",
      audience: "kynd",
    });

    if (payload.type !== "access" || typeof payload.sub !== "string") {
      return ApiResponse.unauthorized(
        res,
        "Invalid access token.",
        "ACCESS_TOKEN_INVALID",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!user) {
      return ApiResponse.unauthorized(
        res,
        "User account not found.",
        "USER_NOT_FOUND",
      );
    }

    res.locals.userId = user.id;
    return next();
  } catch (error: any) {
    if (error?.code?.startsWith("ERR_JWT_")) {
      return ApiResponse.unauthorized(
        res,
        "Session expired.",
        "ACCESS_TOKEN_EXPIRED",
      );
    }

    console.error("Authentication error:", error);
    return ApiResponse.serverError(
      res,
      "Unable to authenticate session.",
      "AUTH_ERROR",
    );
  }
}
