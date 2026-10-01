import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Flower2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { apiFetch } from "../lib/api-client";
import { toast } from "../lib/toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error("This password reset link is missing its token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password.length > 72) {
      toast.error("Password must be less than 72 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        },
      );
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.error || "Unable to reset your password.");
        return;
      }

      setIsReset(true);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-surface via-surface-container-low to-primary-fixed/30 p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl border border-surface-container-high bg-surface-container-lowest shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-primary p-8 text-on-primary lg:flex lg:flex-col lg:justify-between">
          <img
            src="/images/6abb389d3804fbd99866b3ed_1.png"
            alt="Neighbors supporting one another"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/60" />
          <Link to="/" className="relative z-10 flex w-fit items-center gap-2">
            <Flower2 size={30} className="text-primary-fixed" />
            <span className="text-2xl font-extrabold tracking-tight">kynd</span>
          </Link>
          <div className="relative z-10 max-w-sm">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">
              A secure return
            </p>
            <h2 className="text-4xl font-black leading-tight tracking-tight">
              Make your next sign-in feel brand new.
            </h2>
            <p className="mt-5 text-sm leading-6 text-surface-container-low/85">
              Choose a password that is private, memorable, and ready to protect
              your place in the Kynd community.
            </p>
          </div>
          <p className="relative z-10 text-xs text-surface-container-low/70">
            Civic trust, built locally.
          </p>
        </aside>

        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary lg:hidden"
            >
              <Flower2 size={28} />
              <span className="text-2xl font-extrabold tracking-tight">
                kynd
              </span>
            </Link>
            <Link
              to="/signin"
              className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              <ArrowLeft size={15} />
              Back to sign in
            </Link>
          </div>

          {isReset ? (
            <div className="mt-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-on-surface">
                Password reset complete
              </h1>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                Your password has been updated. You can now sign in with your
                new password.
              </p>
              <Link
                to="/signin"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container"
              >
                Continue to sign in
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-16 max-w-lg">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container text-secondary">
                  <KeyRound size={26} />
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Password recovery
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                  Create a new password
                </h1>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  Enter your new password below.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-5"
              >
                <label className="flex flex-col gap-2 text-xs font-bold text-on-surface">
                  New password
                  <span className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-surface-container-high bg-surface px-10 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
                <label className="flex flex-col gap-2 text-xs font-bold text-on-surface">
                  Confirm new password
                  <span className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      type={showConfirmation ? "text" : "password"}
                      required
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-surface-container-high bg-surface px-10 py-3 text-sm text-on-surface focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmation((visible) => !visible)}
                      aria-label={
                        showConfirmation
                          ? "Hide confirmation"
                          : "Show confirmation"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    >
                      {showConfirmation ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <ClipLoader size={17} color="currentColor" />
                  ) : null}
                  {isLoading ? "Resetting..." : "Reset password"}
                  {!isLoading ? <ArrowRight size={15} /> : null}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
