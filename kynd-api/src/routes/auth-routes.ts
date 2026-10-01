import express from "express";
// import { requireAuth } from "../middlewares/requireAuth";
import {
  //   checkAuth,
  signup,
  signin,
  refreshSession,
  resendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
  loginWithGoogle,
  googleOAuthCallback,
} from "../controllers/auth-controllers.ts";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/refresh", refreshSession);
authRoutes.post("/resend-verification", resendVerificationEmail);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.get("/me", getCurrentUser);
authRoutes.post("/logout", logout);
authRoutes.get("/google/login", loginWithGoogle);
authRoutes.get("/google/callback", googleOAuthCallback);
// authRoutes.get("/is-authorized", checkAuth);
// authRoutes.get("/get-nonce", getNonce);
// authRoutes.post("/logout", logout);
// authRoutes.post("/verify", verifySiwe);
// authRoutes.post("/request-otp", requireAuth, requestOtp);
// authRoutes.post("/verify-otp", requireAuth, verifyOtp);
// authRoutes.post("/set-role", requireAuth, setRoleSelection);
// authRoutes.get("/check-username/:username", requireAuth, checkUsernameTaken);
// authRoutes.get("/check-email/:email", checkEmailTaken);

export default authRoutes;
