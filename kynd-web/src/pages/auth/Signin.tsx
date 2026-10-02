import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Flower2,
  LockKeyhole,
  Mail,
  Shield,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { apiFetch } from "../../lib/api-client";
import { toast } from "../../lib/toast";
import { handleImgError } from "../../utils/imageFallback";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, fetchUser } = useAuth();
  const initiateOAuth = () => {
    if (user) {
      toast.error("User is already logged in");
      return;
    }

    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }/api/auth/google/login`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(
          responseData.error || responseData.message || "Unable to sign in.",
        );
        return;
      }

      await fetchUser();
      toast.success("Welcome back to Kynd.");
      navigate("/");
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Unable to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col select-none">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-5">
        <div className="hidden lg:flex lg:col-span-3 relative flex-col justify-between p-8 text-on-primary overflow-hidden bg-primary min-h-screen">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/6abb389d3804fbd99866b3ed_1.png"
              onError={(event) =>
                handleImgError(
                  event,
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMdOdMAYP3Z_CjPx4_1cqkmmsbAF56yXzXBfz45biMPISz7IT41JSXmHog1opO_Lk1uhydCQl3xg3stFoWkzKROp1lr6z9VVDw2Zp0mPIclqDPolRsdHV6di2l653F8mnH45hZYeCgGVWX6oEiOPXNqgfJX7d4IScE0uE0XNIJXDwL3vNmnNdw_IpHzKPo6RkQBPJhwimtuCiYsvdmGlt_Fg61frR4tl4tGNknYdLkTaN8y_mHo5CmmRQ",
                )
              }
              alt="Kynd Mutual Aid Community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-primary/30 backdrop-blur-[1px]" />
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/70 to-transparent" />
          </div>

          <Link to="/" className="relative z-10 flex items-center gap-2 w-fit">
            <Flower2 size={32} className="text-primary-fixed" />
            <span className="text-3xl font-extrabold text-on-primary tracking-tight">
              kynd
            </span>
          </Link>

          <div className="relative z-10 flex flex-col gap-4 my-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/15 backdrop-blur-md border border-surface/20 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-primary-fixed">
                Hyperlocal Aid Mesh
              </span>
            </div>
            <h2 className="font-display text-4xl font-black text-on-primary tracking-tight leading-tight">
              Welcome Back <br />
              <span className="text-primary-fixed">To Your Block</span>
            </h2>
            <p className="text-base text-surface-container-low/90 leading-relaxed max-w-xl">
              Pick up where you left off and keep building a kinder, more
              connected community around you.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-surface/15 flex items-center justify-between text-xs text-surface-container-low/80 max-w-2xl">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary-fixed" />
              Civic Trust Verified
            </span>
            <span className="flex items-center gap-2">
              <Shield size={18} className="text-primary-fixed" />
              Addresses Always Private
            </span>
            <span className="flex items-center gap-2">
              <IndianRupee size={18} className="text-primary-fixed" />
              100% Free &amp; Zero Fees
            </span>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center bg-surface-container-lowest min-h-screen">
          <div className="lg:hidden flex justify-center pb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary font-bold"
            >
              <Flower2 size={30} />
              <span className="text-2xl font-extrabold text-on-surface tracking-tight">
                kynd
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-1 text-center lg:text-left mb-5">
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-on-surface-variant">
              Sign in to keep showing up for your community.
            </p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={initiateOAuth}
            className="w-full py-2.5 cursor-pointer px-4 rounded-xl border border-surface-container-high bg-surface text-on-surface font-label-md text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="relative mt-6 mb-6 flex items-center justify-center">
            <div className="w-full border-t border-surface-container-high" />
            <span className="absolute bg-surface-container-lowest px-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Or
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <label className="flex flex-col gap-1 text-xs font-bold text-on-surface">
              Email Address
              <span className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-10 py-2 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </span>
            </label>

            <label className="flex flex-col gap-1 text-xs font-bold text-on-surface">
              Password
              <span className="relative">
                <LockKeyhole
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                  className="w-full px-10 py-2 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </span>
            </label>

            <div className="-mt-1 text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <ClipLoader size={17} color="currentColor" /> : null}
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading ? <ArrowRight size={15} /> : null}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-on-surface-variant">
            New to Kynd?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
