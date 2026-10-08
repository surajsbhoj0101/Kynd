import { ArrowUpRight, MoreHorizontal, ShieldCheck, Users, MessageSquare } from "lucide-react";
import { toast } from "../../lib/toast.ts";

function RightBar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside
      className={`${
        mobile ? "block" : "hidden xl:block"
      } scrollbar-thin min-w-0 overflow-y-auto px-2 overscroll-contain scrollbar-auto-hide ${
        mobile ? "" : "h-full min-h-0"
      } space-y-4`}
      aria-label="Community information"
    >
      <section className="rounded-2xl bg-primary p-4 text-on-primary shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold">About Ward 89 Community Mesh</p>
          <ArrowUpRight size={15} />
        </div>
        <p className="mt-2 text-[10px] text-on-primary/75">
          Neighbors connected through everyday mutual support.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-surface/10 p-2">
            <p className="text-lg font-bold">2.4k</p>
            <p className="text-[9px] text-on-primary/70">neighbors</p>
          </div>
          <div className="rounded-xl bg-surface/10 p-2">
            <p className="text-lg font-bold">89</p>
            <p className="text-[9px] text-on-primary/70">active circles</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-on-surface">
            Ward 89’s trusted anchors
          </h2>
          <MoreHorizontal size={15} className="text-on-surface-variant" />
        </div>
        {["Ananya Verma", "Dr. Vivek Rao", "Kynd Civic Desk"].map(
          (name, index) => (
            <div key={name} className="mt-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-[9px] font-bold text-on-secondary-container">
                {name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-bold text-on-surface">
                  {name}
                </p>
                <p className="truncate text-[9px] text-on-surface-variant">
                  {index === 0 ? "Community lead" : "Trusted neighbor"}
                </p>
              </div>
              <ShieldCheck size={13} className="text-primary" />
            </div>
          ),
        )}
        <button
          type="button"
          onClick={() => toast.info("Opening message with Ward anchors...")}
          className="mt-4 w-full rounded-lg border border-surface-container-high py-2 text-[10px] font-bold text-primary transition-colors hover:bg-surface-container-low"
        >
          Message ward anchors
        </button>
      </section>

      <section className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-on-surface">
            People you may know
          </h2>
          <Users size={15} className="text-on-surface-variant" />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-on-surface-variant">
          Connect with neighbors who share your interests and skills.
        </p>
        <button
          type="button"
          onClick={() => toast.info("Exploring neighborhood directory...")}
          className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
        >
          Explore directory <ArrowUpRight size={12} />
        </button>
      </section>
    </aside>
  );
}

export default RightBar;

