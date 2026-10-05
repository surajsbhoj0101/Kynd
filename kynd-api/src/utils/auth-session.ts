import crypto from "crypto";
import type { Response } from "express";
import { prisma } from "../config/db.ts";
import { createToken } from "./jwt.ts";

export async function createAuthSession(userId: string, res: Response) {
  const refreshJwtSecret = process.env.REFRESH_JWT_SECRET;
  if (!refreshJwtSecret) {
    throw new Error("REFRESH_JWT_SECRET is not configured.");
  }

  const accessJwtSecret = process.env.ACCESS_JWT_SECRET;
  if (!accessJwtSecret) {
    throw new Error("ACCESS_JWT_SECRET is not configured.");
  }

  const fid = crypto.randomBytes(32).toString("hex");

  // Create Refresh Token
  const refreshJwtPayload = {
    sub: userId,
    familyId: fid,
    type: "refresh",
  };

  const refreshToken = await createToken(refreshJwtPayload, {
    expiresIn: "30d",
    issuer: "kynd",
    audience: "kynd",
    secret: refreshJwtSecret,
  });

  // Hash refresh token
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Store refresh token session in database
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: refreshTokenHash,
      familyId: fid,
      expiresAt: thirtyDaysFromNow,
    },
  });

  // Create Access Token
  const accessJwtPayload = {
    sub: userId,
    familyId: fid,
    type: "access",
  };

  const accessToken = await createToken(accessJwtPayload, {
    expiresIn: "3m",
    issuer: "kynd",
    audience: "kynd",
    secret: accessJwtSecret,
  });

  // Set HTTP-only cookies

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken, familyId: fid };
}
