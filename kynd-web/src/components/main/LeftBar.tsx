import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  HeartHandshake,
  Home,
  MapPinned,
  Users,
} from "lucide-react";
import { LeftBarData } from "../../types/home-types.ts";

type LeftBarProps = {
  leftBarData: LeftBarData;
  mobile?: boolean;
};

const navigation = [
  { label: "My Dashboard", icon: Home, active: true },
  { label: "My Needs", icon: HeartHandshake },
  { label: "My Offers", icon: BriefcaseBusiness },
  { label: "Saved", icon: BookOpen },
  { label: "My Neighborhood", icon: MapPinned },
];

const community = [
  { label: "Urgent & Needs", icon: Bell, count: 4 },
  { label: "Local Teams", icon: Users },
  { label: "Birds of Support", icon: Compass },
  { label: "Learning & Skill Circles", icon: BookOpen },
  { label: "Community Projects", icon: HeartHandshake },
  { label: "Civic & Mission Action", icon: CheckCircle2, count: 1 },
];

function LeftBar({ leftBarData, mobile = false }: LeftBarProps) {
  return (
    <aside className={`${mobile ? "block" : "hidden lg:block"} w-64 shrink-0`}>
      <div className="sticky top-20 space-y-4">
        <section className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                {leftBarData.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {leftBarData.name}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Member since {leftBarData.memberSince}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-secondary-container px-2 py-1 text-[9px] font-bold text-on-secondary-container">
              Level 2
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-3/5 rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-[10px] text-on-surface-variant">
            Keep showing up for your neighborhood.
          </p>
        </section>

        <nav
          className="rounded-2xl border border-surface-container-high bg-surface p-2 shadow-sm"
          aria-label="Dashboard navigation"
        >
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Your space
          </p>
          {navigation.map(({ label, icon: Icon, active }) => (
            <a
              href="#"
              key={label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`}
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </nav>

        <nav
          className="rounded-2xl border border-surface-container-high bg-surface p-2 shadow-sm"
          aria-label="Community navigation"
        >
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Community circles
            </p>
            <a href="#" className="text-[10px] font-bold text-primary">
              Explore
            </a>
          </div>
          {community.map(({ label, icon: Icon, count }) => (
            <a
              href="#"
              key={label}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              <Icon size={14} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {count && (
                <span className="rounded-full bg-tertiary-fixed px-1.5 py-0.5 text-[9px] font-bold text-on-tertiary-fixed">
                  {count}
                </span>
              )}
            </a>
          ))}
        </nav>

        <section className="rounded-2xl bg-primary p-4 text-on-primary shadow-sm">
          <CircleHelp size={18} />
          <h3 className="mt-3 text-sm font-bold">Need a hand?</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-on-primary/75">
            Tell your neighbors what would make this week easier.
          </p>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold"
          >
            Share a need <ChevronRight size={12} />
          </a>
        </section>
      </div>
    </aside>
  );
}

export default LeftBar;
