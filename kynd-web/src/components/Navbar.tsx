import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between gap-gutter">
        
        {/* Simple & Clean Brand Logo */}
        <div className="flex items-center gap-space-md shrink-0">
          <Link className="flex items-center gap-2 text-primary font-bold hover:opacity-90 transition-opacity" to="/">
            <span className="material-symbols-outlined text-[30px] text-primary">spa</span>
            <span className="text-xl md:text-3xl  font-extrabold text-on-surface tracking-tight">
              kynd
            </span>
          </Link>
        </div>

        {/* Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-gutter">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap" to="/need-help">
            Explore Needs
          </Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap" to="/offer-help">
            Offer Help
          </Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap" to="/community">
            Community Teams
          </Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap" to="/philosophy">
            Philosophy
          </Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap" to="/safety">
            Safety
          </Link>
        </nav>

        {/* Action Buttons (Location button removed) */}
        <div className="flex items-center gap-space-sm md:gap-space-md shrink-0">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface px-space-xs transition-colors hidden sm:inline-block" to="/signup">
            Sign In
          </Link>
          <Link className="px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors whitespace-nowrap shadow-sm" to="/signup">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
