import { Navigate, Outlet } from "react-router-dom";
import { Flower2, LoaderCircle } from "lucide-react";
import { AccountStatus } from "../../context/AuthContext.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import App from "../../App.tsx";
import Home from "../../pages/main/Home.tsx";
import MainNavbar from "../main/MainNavbar.tsx";
import ThemeSwitcher from "../ThemeSwitcher.tsx";

function LoadingScreen() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-surface via-surface-container-low to-primary-fixed/30 px-6 text-on-surface"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-24 border-primary/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-32 border-secondary/5" />

      <section className="relative flex w-full max-w-sm flex-col items-center rounded-4xl border border-surface-container-high bg-surface-container-lowest/90 px-8 py-10 text-center shadow-xl backdrop-blur-sm">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-on-primary shadow-lg shadow-primary/20">
          <Flower2 size={38} strokeWidth={1.8} />
          <span className="absolute inset-0 animate-ping rounded-3xl border-2 border-primary/30" />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Kynd
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface">
          Preparing your space
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-6 text-on-surface-variant">
          We’re checking your account and getting everything ready.
        </p>

        <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <LoaderCircle size={16} className="animate-spin text-primary" />
          <span>Just a moment...</span>
        </div>
      </section>
    </main>
  );
}

function destinationForStatus(status: AccountStatus) {
  return status === AccountStatus.ONBOARDING ? "/onboarding" : "/";
}

export function AuthenticatedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.status === AccountStatus.ONBOARDING) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      {/* <MainNavbar /> */}
      <Outlet />
    </>
  );
}
export function OnboardingRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.status !== AccountStatus.ONBOARDING) {
    return <Navigate to={destinationForStatus(user.status)} replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to={destinationForStatus(user.status)} replace />;
  }

  return <Outlet />;
}

export function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <>
        {" "}
        <ThemeSwitcher />
        <App />{" "}
      </>
    );
  }

  if (user.status === AccountStatus.ONBOARDING) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <>
      <MainNavbar />
      <Home />
    </>
  );
}
