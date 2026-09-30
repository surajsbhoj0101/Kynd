import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleImgError } from '../utils/imageFallback';

export default function Signup() {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitted(true);
  };

  const handleGoogleSignUp = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-surface flex flex-col select-none">
      
      {/* 60% / 40% Full Width Split Grid */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-5">
        
        {/* LEFT COLUMN: 60% Width (col-span-3 on PC) */}
        <div className="hidden lg:flex lg:col-span-3 relative flex-col justify-between p-12 text-on-primary overflow-hidden bg-primary min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/images/6abb389d3804fbd99866b3ed_1.png" 
              onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuAMdOdMAYP3Z_CjPx4_1cqkmmsbAF56yXzXBfz45biMPISz7IT41JSXmHog1opO_Lk1uhydCQl3xg3stFoWkzKROp1lr6z9VVDw2Zp0mPIclqDPolRsdHV6di2l653F8mnH45hZYeCgGVWX6oEiOPXNqgfJX7d4IScE0UeXNIJXDwL3vNmnNdw_IpHzKPo6RkQBPJhwimtuCiYsvdmGlt_Fg61frR4tl4tGNknYdLkTaN8y_mHo5CmmRQ")}
              alt="Kynd Mutual Aid Community" 
              className="w-full h-full object-cover"
            />
            {/* Multi-stop emerald overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/30 backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
          </div>

          {/* Left Top Brand Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-primary-fixed">spa</span>
            <span className="text-3xl font-extrabold text-on-primary tracking-tight">
              kynd
            </span>
          </div>

          {/* Left Middle Content */}
          <div className="relative z-10 flex flex-col gap-6 my-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/15 backdrop-blur-md border border-surface/20 text-on-primary w-fit shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide uppercase text-primary-fixed">Hyperlocal Aid Mesh</span>
            </div>
            
            <h2 className="font-display text-4xl lg:text-5xl font-black text-on-primary tracking-tight leading-tight">
              Kindness Belongs <br />
              <span className="text-primary-fixed">On Your Block</span>
            </h2>
            
            <p className="font-body-lg text-base text-surface-container-low/90 leading-relaxed max-w-xl">
              Connect with verified neighbors within walking distance. Share skills, borrow equipment, or request a hand — 100% free with zero rating pressure.
            </p>

            <div className="p-4 rounded-2xl bg-surface/10 backdrop-blur-md border border-surface/15 text-sm text-surface-container-low italic leading-relaxed max-w-lg">
              “Kynd helped our street organize grocery support and tutoring within days. True reciprocal community.”
              <div className="mt-2 font-bold not-italic text-primary-fixed text-xs">— Indiranagar Neighborhood Network</div>
            </div>
          </div>

          {/* Left Bottom Trust Footer */}
          <div className="relative z-10 pt-6 border-t border-surface/15 flex items-center justify-between text-xs text-surface-container-low/80 max-w-2xl">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">verified_user</span>
              <span>Civic Trust Verified</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">shield</span>
              <span>Addresses Always Private</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">currency_rupee</span>
              <span>100% Free &amp; Zero Fees</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: 40% Width (col-span-2 on PC) */}
        <div className="col-span-1 lg:col-span-2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center gap-6 bg-surface-container-lowest min-h-screen overflow-y-auto">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-2 text-center pb-2">
            <Link className="flex items-center gap-2 text-primary font-bold hover:opacity-90 transition-opacity" to="/">
              <span className="material-symbols-outlined text-[30px] text-primary">spa</span>
              <span className="text-2xl font-extrabold text-on-surface tracking-tight">
                kynd
              </span>
            </Link>
          </div>

          {isSubmitted ? (
            /* Success Screen */
            <div className="flex flex-col items-center text-center py-8 gap-4 my-auto">
              <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-md animate-bounce-subtle">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <h2 className="font-headline-lg text-2xl text-on-surface font-bold">
                Account Created!
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant">
                Welcome to Kynd. Your profile is ready.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary-container transition-all"
              >
                Go to Home Page
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1 text-center lg:text-left">
                <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
                  Create Your Free Account
                </h1>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Join verified neighbors on your block.
                </p>
              </div>

              {/* Google Signup */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full py-2.5 px-4 rounded-xl border border-surface-container-high bg-surface text-on-surface font-label-md text-xs font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3 shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-0.5">
                <div className="border-t border-surface-container-high w-full"></div>
                <span className="bg-surface-container-lowest px-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider relative z-10">
                  Or
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                
                {/* Method Toggle: Email vs Phone */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-xs font-bold text-on-surface">
                      {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod(authMethod === 'email' ? 'phone' : 'email');
                        setContactValue('');
                      }}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Use {authMethod === 'email' ? 'Phone' : 'Email'} instead
                    </button>
                  </div>

                  <input
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    required
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={authMethod === 'email' ? 'name@example.com' : '+91 98765 43210'}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-bold text-on-surface">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-xs font-bold text-on-surface">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-error-container/40 text-on-error-container text-xs font-semibold border border-error-container">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="mt-1 w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-sm font-bold hover:bg-primary-container transition-all shadow-md"
                >
                  Create Free Account
                </button>
              </form>

              {/* Bottom Link */}
              <div className="text-center lg:text-left pt-1 text-xs text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
