import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Flower2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { apiFetch } from "../../lib/api-client";
import { toast } from "../../lib/toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const responseData = await response.json();
      if (!response.ok) {
        toast.error(responseData.error || "Unable to send reset email.");
        return;
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-surface via-surface-container-low to-primary-fixed/30 p-4 sm:p-8">
      <div className="grid  w-full max-w-6xl overflow-hidden rounded-4xl border border-surface-container-high bg-surface-container-lowest shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
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
              Your account, protected
            </p>
            <h2 className="text-4xl font-black leading-tight tracking-tight">
              A fresh start is only one link away.
            </h2>
            <p className="mt-5 text-sm leading-6 text-surface-container-low/85">
              Reset your password securely, then get back to the people and
              places that make your block feel like home.
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

          {isSubmitted ? (
            <div className="mt-16 max-w-lg text-center lg:text-left">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary lg:mx-0">
                <Mail size={30} />
              </div>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-on-surface">
                Check your inbox
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-on-surface-variant lg:mx-0">
                If an account exists for <strong>{email}</strong>, we sent a
                link to reset its password. The link expires in 1 hour.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                Try another email
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="mt-16 max-w-lg">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Password recovery
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
                Forgot your password?
              </h1>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                Enter your email and we&apos;ll send you a secure reset link.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="flex flex-col gap-2 text-xs font-bold text-on-surface">
                  Email address
                  <span className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-surface-container-high bg-surface px-10 py-3 text-sm text-on-surface outline-none transition-colors focus:border-primary"
                    />
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <ClipLoader size={17} color="currentColor" />
                  ) : null}
                  {isLoading ? "Sending..." : "Send reset link"}
                  {!isLoading ? <ArrowRight size={15} /> : null}
                </button>
                <div className="mt-6 flex items-start gap-3 border-t border-surface-container-high pt-5 text-xs leading-5 text-on-surface-variant">
                  <Clock3 size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    The link expires in 1 hour and can only be used once.
                  </span>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
