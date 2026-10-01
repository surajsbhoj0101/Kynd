import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";
import Signup from "./pages/Signup.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import Signin from "./pages/Signin.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import ThemeSwitcher from "./components/ThemeSwitcher.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <ThemeSwitcher />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

