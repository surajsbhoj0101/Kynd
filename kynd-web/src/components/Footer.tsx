import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg pt-space-2xl pb-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-gutter-lg">
          <div className="lg:col-span-3 flex flex-col gap-space-md">
            <div className="flex items-center mb-3">
              <Link className="flex items-center gap-2 text-primary font-bold hover:opacity-90 transition-opacity" to="/">
                <span className="material-symbols-outlined text-[30px] text-primary">spa</span>
                <span className="text-xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                  kynd
                </span>
              </Link>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Hyperlocal infrastructure for mutual aid. Reciprocal, dignified support rooted on your block.
            </p>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm pt-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span>Civic Trust Verified Network</span>
            </div>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">Participate</span>
            <nav className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/need-help">Need Help</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/offer-help">Offer Help</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/community">Community Teams</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">Trust &amp; Safety</span>
            <nav className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/safety">Safety Standards</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/safety">Verification</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/safety">Guidelines</Link>
            </nav>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-title-md text-title-md text-on-surface">About</span>
            <nav className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/philosophy">Our Philosophy</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/philosophy">Impact</Link>
              <Link className="text-on-surface-variant hover:text-on-surface transition-colors" to="/safety">Privacy</Link>
            </nav>
          </div>
        </div>
        <div className="mt-space-2xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
          <span>© 2026 Kynd Mutual Help Network, Inc. All rights reserved.</span>
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              Neighborhood Mesh Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
