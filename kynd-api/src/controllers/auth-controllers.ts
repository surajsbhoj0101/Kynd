import { ApiResponse } from "../utils/api-response.ts";
import { Request, Response } from "express";
import { prisma } from "../config/db.ts";
import { OAuthProvider } from "../../generated/prisma/enums.ts";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createToken, verifyToken } from "../utils/jwt.ts";
import { createAuthSession } from "../utils/auth-session.ts";
import { sendEmail } from "../services/mail.ts";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      console.log("Invalid request body");
      return ApiResponse.badRequest(
        res,
        "Invalid request body",
        "INVALID_BODY",
      );
    }

    if (name.length < 2) {
      return ApiResponse.badRequest(
        res,
        "Name must be at least 2 characters long",
        "INVALID_NAME",
      );
    }

    if (name.length > 50) {
      return ApiResponse.badRequest(
        res,
        "Name must be less than 50 characters long",
        "INVALID_NAME",
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return ApiResponse.badRequest(
        res,
        "Invalid email format",
        "INVALID_EMAIL",
      );
    }

    if (trimmedEmail.length > 254) {
      return ApiResponse.badRequest(res, "Email is too long", "INVALID_EMAIL");
    }

    if (password.length < 8) {
      return ApiResponse.badRequest(
        res,
        "Password must be at least 8 characters long",
        "INVALID_PASSWORD",
      );
    }

    if (password.length > 72) {
      return ApiResponse.badRequest(
        res,
        "Password is too long",
        "INVALID_PASSWORD",
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    if (existingUser?.status === "COMPLETE") {
      return ApiResponse.conflict(
        res,
        "User with this email already exists",
        "USER_EXISTS",
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name: trimmedName,
          passwordHash,
          status: "PENDING",
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          passwordHash,
          status: "PENDING",
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });
    }

    const jwtSecret = process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const appUrl = process.env.PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("PUBLIC_APP_URL is not configured");
    }

    const jwtPayload = {
      sub: user.id,
      type: "auth",
    };
    let verificationToken;
    try {
      verificationToken = await createToken(jwtPayload, {
        expiresIn: "2h",
        issuer: "kynd",
        audience: "kynd",
        secret: jwtSecret,
      });
    } catch (error) {
      console.error("Failed to create verification token:", error);
      return ApiResponse.serverError(
        res,
        "Failed to create verification token",
        "TOKEN_CREATION_FAILED",
      );
    }
    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(
      verificationToken,
    )}`;

    const safeName = escapeHtml(user.name);

    await sendEmail(
      user.email,
      "Verify your email",
      "Please verify your email address to activate your account.",
      `
        <h1>Verify your email</h1>

        <p>Hello ${safeName},</p>

        <p>
          Thanks for creating your account.
          Please verify your email address to activate your account.
        </p>

        <p>
          ${verificationUrl}           
          
        </p>

        <p>
          This verification link will expire in 2 hours.
        </p>
      `,
    );

    return ApiResponse.success(
      res,
      { user },
      "Registration successful. Please verify your email.",
      201,
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.code === "P2002") {
      return ApiResponse.conflict(
        res,
        "User with this email already exists",
        "USER_EXISTS",
      );
    }

    return ApiResponse.serverError(
      res,
      "An unexpected error occurred while registering user",
      "REGISTRATION_ERROR",
    );
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return ApiResponse.badRequest(
        res,
        "Email and password are required",
        "INVALID_BODY",
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user || !user.passwordHash) {
      return ApiResponse.unauthorized(
        res,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return ApiResponse.unauthorized(
        res,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
      );
    }

    if (user.status !== "COMPLETE") {
      return ApiResponse.forbidden(
        res,
        "Please verify your email before signing in",
        "EMAIL_NOT_VERIFIED",
      );
    }

    await createAuthSession(user.id, res);

    return ApiResponse.success(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      "Signed in successfully",
    );
  } catch (error) {
    console.error("Signin error:", error);
    return ApiResponse.serverError(res, "Unable to sign in", "SIGNIN_ERROR");
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
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
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      return ApiResponse.unauthorized(
        res,
        "User account not found.",
        "USER_NOT_FOUND",
      );
    }

    return ApiResponse.success(res, { user }, "Current user loaded.");
  } catch (error: any) {
    if (error?.code?.startsWith("ERR_JWT_")) {
      return ApiResponse.unauthorized(
        res,
        "Session expired.",
        "ACCESS_TOKEN_EXPIRED",
      );
    }

    console.error("Current user error:", error);
    return ApiResponse.serverError(
      res,
      "Unable to load current user.",
      "CURRENT_USER_ERROR",
    );
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });

    return ApiResponse.success(res, undefined, "Signed out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return ApiResponse.serverError(res, "Unable to sign out.", "LOGOUT_ERROR");
  }
};

export const refreshSession = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return ApiResponse.unauthorized(
        res,
        "Refresh token missing.",
        "REFRESH_TOKEN_MISSING",
      );
    }

    const refreshJwtSecret = process.env.REFRESH_JWT_SECRET;
    if (!refreshJwtSecret) {
      throw new Error("REFRESH_JWT_SECRET is not configured.");
    }

    let payload;
    try {
      payload = await verifyToken(refreshToken, {
        secret: refreshJwtSecret,
        issuer: "kynd",
        audience: "kynd",
      });
    } catch {
      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/" });
      return ApiResponse.unauthorized(
        res,
        "Invalid or expired refresh token.",
        "REFRESH_TOKEN_INVALID",
      );
    }

    if (
      payload.type !== "refresh" ||
      typeof payload.sub !== "string" ||
      typeof payload.familyId !== "string"
    ) {
      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/" });
      return ApiResponse.unauthorized(
        res,
        "Invalid refresh token.",
        "REFRESH_TOKEN_INVALID",
      );
    }

    const incomingTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: incomingTokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt !== null) {
      await prisma.refreshToken.updateMany({
        where: { familyId: payload.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      res.clearCookie("access_token", { path: "/" });
      res.clearCookie("refresh_token", { path: "/" });
      return ApiResponse.unauthorized(
        res,
        "Security violation: refresh token reused or invalid. Session invalidated.",
        "TOKEN_REUSE_DETECTED",
      );
    }

    if (storedToken.expiresAt < new Date()) {
      return ApiResponse.unauthorized(
        res,
        "Refresh token expired in database.",
        "REFRESH_TOKEN_EXPIRED",
      );
    }

    if (storedToken.user.status === "PENDING") {
      return ApiResponse.forbidden(
        res,
        "User email address is not verified.",
        "USER_UNVERIFIED",
      );
    }

    const accessJwtSecret = process.env.ACCESS_JWT_SECRET;
    if (!accessJwtSecret) {
      throw new Error("ACCESS_JWT_SECRET is not configured.");
    }

    const newRefreshToken = await createToken(
      {
        sub: storedToken.userId,
        familyId: storedToken.familyId,
        type: "refresh",
      },
      {
        expiresIn: "30d",
        issuer: "kynd",
        audience: "kynd",
        secret: refreshJwtSecret,
      },
    );
    const newAccessToken = await createToken(
      {
        sub: storedToken.userId,
        familyId: storedToken.familyId,
        type: "access",
      },
      {
        expiresIn: "3m",
        issuer: "kynd",
        audience: "kynd",
        secret: accessJwtSecret,
      },
    );

    const newRefreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          userId: storedToken.userId,
          tokenHash: newRefreshTokenHash,
          familyId: storedToken.familyId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3 * 60 * 1000,
    });
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, null, "Tokens refreshed successfully.");
  } catch (error) {
    console.error("Refresh session error:", error);
    return ApiResponse.serverError(
      res,
      "An unexpected error occurred while refreshing tokens.",
      "REFRESH_ERROR",
    );
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string") {
      return ApiResponse.badRequest(
        res,
        "Invalid request body",
        "INVALID_BODY",
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: trimmedEmail,
      },
    });

    if (!user) {
      return ApiResponse.notFound(
        res,
        "User with this email does not exist",
        "USER_NOT_FOUND",
      );
    }

    if (user.status === "COMPLETE") {
      return ApiResponse.conflict(
        res,
        "User with this email is already verified",
        "USER_ALREADY_VERIFIED",
      );
    }

    const jwtSecret = process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const appUrl = process.env.PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("PUBLIC_APP_URL is not configured");
    }

    const verificationToken = await createToken(
      { sub: user.id, type: "auth" },
      {
        expiresIn: "2h",
        issuer: "kynd",
        audience: "kynd",
        secret: jwtSecret,
      },
    );

    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(
      verificationToken,
    )}`;
    const safeName = escapeHtml(user.name);

    await sendEmail(
      user.email,
      "Verify your email",
      "Please verify your email address to activate your account.",
      `
        <h1>Verify your email</h1>
        <p>Hello ${safeName},</p>
        <p>
          Here is your new verification link. Please verify your email address
          to activate your account.
        </p>
        <p>${verificationUrl}</p>
        <p>This verification link will expire in 2 hours.</p>
      `,
    );

    return ApiResponse.success(res, undefined, "Verification email sent.");
  } catch (error: any) {
    console.error("Resend verification email error:", error);

    return ApiResponse.serverError(
      res,
      "Unable to resend verification email",
      "RESEND_VERIFICATION_ERROR",
    );
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (typeof token !== "string" || !token.trim()) {
      return ApiResponse.badRequest(
        res,
        "Verification token is required",
        "TOKEN_REQUIRED",
      );
    }

    const jwtSecret = process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = await verifyToken(token, {
      issuer: "kynd",
      audience: "kynd",
      secret: jwtSecret,
    });

    if (payload.type !== "auth" || typeof payload.sub !== "string") {
      return ApiResponse.badRequest(
        res,
        "Invalid verification token",
        "INVALID_TOKEN",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });

    if (!user) {
      return ApiResponse.notFound(
        res,
        "User associated with this token was not found",
        "USER_NOT_FOUND",
      );
    }

    if (user.status === "COMPLETE") {
      return ApiResponse.success(
        res,
        { email: user.email },
        "Email is already verified.",
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: "COMPLETE" },
    });

    return ApiResponse.success(
      res,
      { email: user.email },
      "Email verified successfully.",
    );
  } catch (error: any) {
    console.error("Email verification error:", error);

    if (error?.code === "ERR_JWT_EXPIRED") {
      return ApiResponse.badRequest(
        res,
        "This verification link has expired",
        "TOKEN_EXPIRED",
      );
    }

    if (error?.code?.startsWith("ERR_JWT_")) {
      return ApiResponse.badRequest(
        res,
        "This verification link is invalid",
        "INVALID_TOKEN",
      );
    }

    return ApiResponse.serverError(
      res,
      "Unable to verify email",
      "EMAIL_VERIFICATION_ERROR",
    );
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string") {
      return ApiResponse.badRequest(res, "Email is required", "INVALID_BODY");
    }

    const trimmedEmail = email.trim().toLowerCase();
    const appUrl = process.env.PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("PUBLIC_APP_URL is not configured");
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (user?.passwordHash) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      });
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(
        resetToken,
      )}`;

      await sendEmail(
        user.email,
        "Reset your Kynd password",
        `Use this link to reset your Kynd password: ${resetUrl}`,
        `
          <h1>Reset your Kynd password</h1>
          <p>Hello ${escapeHtml(user.name)},</p>
          <p>Use the link below to choose a new password.</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
          <p>This link will expire in 1 hour and can only be used once.</p>
        `,
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      "If an account exists for that email, a password reset link has been sent.",
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return ApiResponse.serverError(
      res,
      "Unable to send password reset email",
      "FORGOT_PASSWORD_ERROR",
    );
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (typeof token !== "string" || !token.trim()) {
      return ApiResponse.badRequest(
        res,
        "Password reset token is required",
        "TOKEN_REQUIRED",
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return ApiResponse.badRequest(
        res,
        "Password must be at least 8 characters long",
        "INVALID_PASSWORD",
      );
    }

    if (password.length > 72) {
      return ApiResponse.badRequest(
        res,
        "Password is too long",
        "INVALID_PASSWORD",
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return ApiResponse.badRequest(
        res,
        "This password reset link is invalid or has expired",
        "INVALID_RESET_TOKEN",
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    await prisma.$transaction(async (transaction) => {
      const consumedToken = await transaction.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      });

      if (consumedToken.count !== 1) {
        throw new Error("RESET_TOKEN_ALREADY_USED");
      }

      await transaction.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      });
      await transaction.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: now },
      });
    });

    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });

    return ApiResponse.success(res, undefined, "Password reset successfully.");
  } catch (error: any) {
    console.error("Reset password error:", error);

    if (error?.message === "RESET_TOKEN_ALREADY_USED") {
      return ApiResponse.badRequest(
        res,
        "This password reset link is invalid or has expired",
        "INVALID_RESET_TOKEN",
      );
    }

    return ApiResponse.serverError(
      res,
      "Unable to reset password",
      "RESET_PASSWORD_ERROR",
    );
  }
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  // Generate state
  const state = crypto.randomBytes(32).toString("hex");

  // Generate PKCE verifier
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  // Generate PKCE challenge
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Google authorization URL
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  googleUrl.searchParams.set("client_id", process.env.GOOGLE_OAUTH_CLIENT_ID!);

  googleUrl.searchParams.set(
    "redirect_uri",
    process.env.GOOGLE_OAUTH_REDIRECT_URI!,
  );

  googleUrl.searchParams.set("response_type", "code");

  googleUrl.searchParams.set("scope", "email profile");

  googleUrl.searchParams.set("state", state);

  googleUrl.searchParams.set("code_challenge", codeChallenge);

  googleUrl.searchParams.set("code_challenge_method", "S256");

  // Store values needed by callback
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 10 * 60 * 1000,
  });

  res.cookie("oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 10 * 60 * 1000,
  });

  return res.redirect(googleUrl.toString());
};

export const googleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : null;
    const state = typeof req.query.state === "string" ? req.query.state : null;

    if (!code || !state) {
      return ApiResponse.badRequest(
        res,
        "Missing code or state",
        "MISSING_OAUTH_PARAMS",
      );
    }

    const storedState = req.cookies?.oauth_state;
    const codeVerifier = req.cookies?.oauth_code_verifier;

    if (!storedState || state !== storedState) {
      return ApiResponse.badRequest(
        res,
        "Invalid state",
        "INVALID_OAUTH_STATE",
      );
    }

    if (!codeVerifier) {
      return ApiResponse.badRequest(
        res,
        "Missing PKCE verifier",
        "MISSING_PKCE_VERIFIER",
      );
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        code,
        code_verifier: codeVerifier,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Google token error:", error);
      return ApiResponse.badRequest(
        res,
        "Failed to exchange authorization code",
        "OAUTH_EXCHANGE_FAILED",
      );
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    if (!accessToken) {
      return ApiResponse.badRequest(
        res,
        "Missing access token",
        "MISSING_ACCESS_TOKEN",
      );
    }

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const googleUser = await userResponse.json();

    if (!googleUser || !googleUser.email) {
      return ApiResponse.badRequest(
        res,
        "Failed to retrieve Google user profile.",
        "OAUTH_PROFILE_FAILED",
      );
    }

    const normalizedEmail = googleUser.email.trim().toLowerCase();
    const providerAccountId = (googleUser.id || googleUser.sub) as
      | string
      | undefined;

    // Find or create user from Google profile
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: googleUser.name || normalizedEmail.split("@")[0],
          status: "COMPLETE",
        },
      });
    } else if (user.status === "PENDING") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { status: "COMPLETE" },
      });
    }

    // Link/store Google OAuth Account record
    if (providerAccountId) {
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: OAuthProvider.GOOGLE,
            providerAccountId,
          },
        },
        update: {
          userId: user.id,
        },
        create: {
          userId: user.id,
          provider: OAuthProvider.GOOGLE,
          providerAccountId,
        },
      });
    }

    // Create session tokens & set cookies
    await createAuthSession(user.id, res);

    // Clean up temporary OAuth cookies
    res.clearCookie("oauth_state", { path: "/api/auth/google" });
    res.clearCookie("oauth_code_verifier", { path: "/api/auth/google" });

    return res.redirect(process.env.PUBLIC_APP_URL || "http://localhost:5173/");
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    return ApiResponse.serverError(
      res,
      "An unexpected error occurred during Google authentication.",
      "GOOGLE_AUTH_ERROR",
    );
  }
};
