import {
  Bell,
  ChevronRight,
  House,
  Map,
  MessageCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";
import LeftBar from "./LeftBar.tsx";
import RightBar from "./RightBar.tsx";
import { LeftBarData } from "../../types/home-types.ts";

type MobileHomeMenuProps = {
  open: boolean;
  onClose: () => void;
  onOpenLocation: () => void;
};

function MobileHomeMenu({
  open,
  onClose,
  onOpenLocation,
}: MobileHomeMenuProps) {
  const { user } = useAuth();
  if (!open) return null;

  const leftBarData: LeftBarData = {
    name: user?.name || "Neighbor",
    memberSince: "2024",
    level: 2,
    progress: 0.6,
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-on-surface/35 backdrop-blur-sm lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="h-full w-[min(88vw,23rem)] overflow-y-auto bg-surface-container-low p-4 shadow-2xl"
        aria-label="Mobile navigation menu"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Kynd
            </p>
            <h2 className="text-lg font-extrabold text-on-surface">
              Your community
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-full p-2 text-on-surface-variant hover:bg-surface hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-surface-container-high bg-surface p-2"
          aria-label="Quick navigation"
        >
          {[
            { label: "Home", icon: House, href: "/" },
            { label: "Explore", icon: Map, href: "/need-help" },
            { label: "Messages", icon: MessageCircle, href: "/messages" },
            { label: "Alerts", icon: Bell, href: "#" },
          ].map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenLocation();
          }}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-surface-container-high bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary-fixed/30"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
            <Map size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Your location
            </span>
            <span className="mt-0.5 block truncate text-sm font-bold text-on-surface">
              {user?.location?.areaLabel || "Choose your area"}
            </span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-primary" />
        </button>

        <div className="space-y-4 [&_aside]:w-full">
          <LeftBar leftBarData={leftBarData} mobile />
          <RightBar mobile />
        </div>

        <a
          href="/need-help"
          onClick={onClose}
          className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-on-primary"
        >
          Share a need or offer
          <ChevronRight size={16} />
        </a>
      </aside>
    </div>
  );
}

export default MobileHomeMenu;
