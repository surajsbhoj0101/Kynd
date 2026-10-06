import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Signup from "./pages/auth/Signup.tsx";
import VerifyEmail from "./pages/auth/VerifyEmail.tsx";
import Signin from "./pages/auth/Signin.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import ThemeSwitcher from "./components/ThemeSwitcher.tsx";
import Onboarding from "./pages/onboarding/Onboarding.tsx";
import {
  GuestRoute,
  OnboardingRoute,
  HomeRoute,
  AuthenticatedRoute,
} from "./components/auth/RouteGuards.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import NewPost from "./pages/post/NewPost.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },

  {
    element: <GuestRoute />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    element: <OnboardingRoute />,
    children: [
      {
        path: "/onboarding",
        element: <Onboarding />,
      },
    ],
  },

  {
    element: <AuthenticatedRoute />,
    children: [
      {
        path: "/new-post",
        element: <NewPost />,
        //   path: "/profile",
        //   element: <Profile />,
        // },
        // {
        //   path: "/requests",
        //   element: <Requests />,
        // },
        // {
        //   path: "/messages",
        //   element: <Messages />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ThemeSwitcher />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </StrictMode>,
);
