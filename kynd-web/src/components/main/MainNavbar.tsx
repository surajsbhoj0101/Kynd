import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Flower2,
  Menu,
  House,
  Map,
  MapPin,
  MessageCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Location from "./modals/Location";
import MobileHomeMenu from "./MobileHomeMenu";
function MainNavbar() {
  const { user, fetchUser } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AP";

  const [isLocationPopUpOpen, setIsLocationPopUpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Location
        open={isLocationPopUpOpen}
        onClose={() => setIsLocationPopUpOpen(false)}
        onLocationSaved={() => {
          void fetchUser();
          setIsLocationPopUpOpen(false);
        }}
      />
      <MobileHomeMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenLocation={() => setIsLocationPopUpOpen(true)}
      />
      <header className="sticky top-0 z-50 border-b border-surface-container-high bg-surface/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-gutter px-margin md:px-margin-md lg:px-margin-lg">
          <div className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-4">
            <div className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary sm:hidden"
              >
                <Menu size={21} />
              </button>
              <Link
                className="group hidden shrink-0 items-center gap-2.5 text-primary transition-opacity hover:opacity-90 sm:flex"
                to="/"
                aria-label="Kynd home"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm transition-transform group-hover:rotate-6">
                  <Flower2 size={21} strokeWidth={1.8} />
                </span>
                <span className="text-xl font-extrabold tracking-tight text-on-surface sm:text-2xl">
                  kynd
                </span>
              </Link>
            </div>
            <span className="hidden h-8 border-l border-surface-container-high sm:block" />
            <button
              type="button"
              aria-label={`Change your location. Current location is ${
                user?.location?.areaLabel || "not set"
              }`}
              onClick={() => setIsLocationPopUpOpen(!isLocationPopUpOpen)}
              className="group hidden min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-surface-container-low sm:flex"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container transition-colors group-hover:bg-secondary-fixed">
                <MapPin size={16} />
              </span>
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="truncate text-sm font-semibold text-on-surface">
                  {user?.location?.areaLabel || "Your area"}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.625rem] font-medium text-on-primary-fixed-variant">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  992 neighbors nearby
                </span>
              </span>
              <ChevronDown
                size={15}
                className="hidden shrink-0 text-on-surface-variant sm:block"
              />
            </button>
          </div>

          <div className="mx-auto flex min-w-0 max-w-[360px] flex-1">
            <input
              type="text"
              placeholder="Search for needs ..."
              aria-label="Search for needs"
              className="h-9 w-full rounded-xl border border-surface-container-high bg-surface-container-low px-3 text-xs text-on-surface-variant outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-10 sm:px-4 sm:text-sm"
            />
          </div>

          <nav
            className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              aria-label="Home"
              className="hidden rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary sm:block"
            >
              <House size={19} strokeWidth={2} />
            </Link>
            <Link
              to="/need-help"
              aria-label="Explore needs"
              className="hidden rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary sm:block"
            >
              <Map size={19} strokeWidth={2} />
            </Link>
            <Link
              to="/messages"
              aria-label="Messages, 2 unread"
              className="relative hidden rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary sm:block"
            >
              <MessageCircle size={19} strokeWidth={2} />
              <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-on-primary">
                2
              </span>
            </Link>
            <button
              type="button"
              aria-label="Notifications"
              className="relative hidden rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary sm:block"
            >
              <Bell size={19} strokeWidth={2} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-tertiary" />
            </button>
            <Link
              to="/need-help"
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-bold text-on-primary shadow-sm transition-colors hover:bg-primary-container sm:inline-flex sm:px-4"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Share Need or Offer</span>
              <span className="sm:hidden">Share</span>
            </Link>
            <Link
              to="/profile"
              aria-label={`Open ${user?.name || "your"} profile`}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary ring-2 ring-primary/10 transition-transform hover:scale-105"
            >
              {initials}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export default MainNavbar;
