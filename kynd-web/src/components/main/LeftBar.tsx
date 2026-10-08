import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Compass,
  HeartHandshake,
  House,
  MapPinned,
  Sparkles,
  Users,
} from "lucide-react";
import { LeftBarData } from "../../types/home-types.ts";
import { PostType } from "../../types/post-types.ts";
import { useState } from "react";

type LeftBarProps = {
  leftBarData: LeftBarData;
  mobile?: boolean;
  onOpenNewPost?: (type?: PostType) => void;
};

const navigation = [
  { id: "dashboard", label: "My Dashboard", icon: House, count: null },
  { id: "needs", label: "My Needs", icon: HeartHandshake, count: 2 },
  { id: "offers", label: "My Offers", icon: BriefcaseBusiness, count: 3 },
  { id: "saved", label: "Saved Posts", icon: BookOpen, count: null },
  { id: "neighborhood", label: "Neighborhood Map", icon: MapPinned, count: null },
];

const community = [
  { label: "Urgent & Needs", icon: Bell, count: 4 },
  { label: "Local Teams", icon: Users, count: null },
  { label: "Birds of Support", icon: Compass, count: null },
  { label: "Learning & Skill Circles", icon: BookOpen, count: 5 },
  { label: "Community Projects", icon: HeartHandshake, count: null },
  { label: "Civic & Mission Action", icon: CheckCircle2, count: 1 },
];

function LeftBar({ leftBarData, mobile = false, onOpenNewPost }: LeftBarProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const initials = leftBarData.name
    ? leftBarData.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AP";

  return (
    <aside
      className={`${
        mobile
          ? "block"
          : "hidden lg:block lg:h-full lg:min-h-0 lg:border-r lg:border-surface-container-high"
      } w-64 shrink-0`}
    >
      <div
        className={`scrollbar-thin space-y-4 ${
          mobile
            ? ""
            : "scrollbar-auto-hide px-2 h-full min-h-0 overflow-y-auto"
        }`}
      >
        {/* User Card */}
        <section className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                {initials}
              </span>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {leftBarData.name || "Neighbor"}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  Member since {leftBarData.memberSince}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-secondary-container px-2 py-1 text-[9px] font-bold text-on-secondary-container">
              Level {leftBarData.level || 2}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(leftBarData.progress || 0.6) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-on-surface-variant">
            Keep showing up for your neighborhood.
          </p>
        </section>

        {/* Space Navigation */}
        <nav
          className="rounded-2xl border border-surface-container-high bg-surface p-2 shadow-sm"
          aria-label="Dashboard navigation"
        >
          <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Your space
          </p>
          <div className="space-y-1">
            {navigation.map(({ id, label, icon: Icon, count }) => {
              const active = activeTab === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={15} />
                    <span>{label}</span>
                  </span>
                  {count !== null && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        active
                          ? "bg-on-primary/20 text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Community Circles */}
        <nav
          className="rounded-2xl border border-surface-container-high bg-surface p-2 shadow-sm"
          aria-label="Community navigation"
        >
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Community circles
            </p>
            <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">
              Explore
            </span>
          </div>
          <div className="space-y-1">
            {community.map(({ label, icon: Icon, count }) => (
              <button
                type="button"
                key={label}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              >
                <Icon size={14} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                {count && (
                  <span className="rounded-full bg-tertiary-fixed px-1.5 py-0.5 text-[9px] font-bold text-on-tertiary-fixed">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Mutual Aid CTA */}
        <section className="rounded-2xl bg-primary p-4 text-on-primary shadow-sm">
          <Sparkles size={18} className="text-primary-fixed" />
          <h3 className="mt-3 text-sm font-bold">Need a hand?</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-on-primary/75">
            Tell your neighbors what would make this week easier.
          </p>
          <button
            type="button"
            onClick={() => onOpenNewPost?.("LOOKING_FOR_HELP")}
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-on-primary hover:underline"
          >
            <span>Share a need</span>
            <ChevronRight size={12} />
          </button>
        </section>
      </div>
    </aside>
  );
}

export default LeftBar;

