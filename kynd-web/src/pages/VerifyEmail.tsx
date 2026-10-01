import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Flower2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { apiFetch } from "../lib/api-client";

type VerificationState = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setState("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/verify-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          },
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.error ||
              responseData.message ||
              "This verification link could not be used.",
          );
        }

        setState("success");
        setMessage(responseData.message || "Your email has been verified.");
      } catch (error) {
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify your email. Please request a new link.",
        );
      }
    };

    void verifyEmail();
  }, [searchParams]);

  const isSuccess = state === "success";
  const isError = state === "error";

  const statusIcon = isSuccess ? (
    <CheckCircle2 size={34} strokeWidth={2.25} />
  ) : isError ? (
    <XCircle size={34} strokeWidth={2.25} />
  ) : (
    <MailCheck size={34} strokeWidth={2.25} />
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-surface-container-low to-primary-fixed/30 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[24px] border-primary/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[32px] border-secondary/5" />

      <section className="relative grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-surface-container-high bg-surface-container-lowest shadow-xl lg:grid-cols-[0.8fr_1.2fr]">
        <div className="hidden flex-col justify-between bg-primary p-8 text-on-primary lg:flex">
          <Link to="/" className="inline-flex items-center gap-2">
            <Flower2 size={28} className="text-primary-fixed" />
            <span className="text-2xl font-extrabold tracking-tight">kynd</span>
          </Link>

          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <ShieldCheck size={26} />
            </div>
            <h2 className="text-3xl font-black leading-tight">
              One small step toward a kinder block.
            </h2>
            <p className="text-sm leading-6 text-surface-container-low/80">
              Your email helps keep Kynd welcoming, trusted, and connected to
              real neighbors.
            </p>
          </div>

          <p className="text-xs text-surface-container-low/70">
            Civic trust, built locally.
          </p>
        </div>

        <div className="p-6 text-center sm:p-10">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary"
            >
              <Flower2 size={28} />
              <span className="text-2xl font-extrabold tracking-tight">
                kynd
              </span>
            </Link>
          </div>

          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${
              isSuccess
                ? "bg-primary-fixed text-primary"
                : isError
                ? "bg-error-container text-error"
                : "bg-secondary-container text-secondary"
            }`}
          >
            {state === "loading" ? (
              <ClipLoader color="currentColor" size={34} />
            ) : (
              statusIcon
            )}
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
            {state === "loading"
              ? "Please wait"
              : isSuccess
              ? "Account ready"
              : "Action needed"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
            {state === "loading"
              ? "Verifying your email"
              : isSuccess
              ? "Email verified"
              : "Verification failed"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-on-surface-variant">
            {message}
          </p>

          {isSuccess && (
            <Link
              to="/"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container"
            >
              Continue to sign in
              <ArrowRight size={16} />
            </Link>
          )}
          {isError && (
            <Link
              to="/signup"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-colors hover:bg-primary-container"
            >
              <RefreshCw size={16} />
              Return to sign up
            </Link>
          )}

          <Link
            to="/"
            className="mt-5 inline-block text-xs font-bold text-primary hover:underline"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
