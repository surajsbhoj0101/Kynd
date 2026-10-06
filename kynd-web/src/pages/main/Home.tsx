import {
  Bookmark,
  ChevronDown,
  Clock3,
  Ellipsis,
  Heart,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Tag,
} from "lucide-react";
import LeftBar from "../../components/main/LeftBar";
import { useEffect, useState } from "react";
import RightBar from "../../components/main/RightBar";
import { apiFetch } from "../../lib/api-client.ts";
import { toast } from "../../lib/toast.ts";
import { LeftBarData } from "../../types/home-types.ts";

const posts = [
  {
    type: "NEED",
    title:
      "Cardiac Medication Pickup from Apollo 14th Main Junction before 4 PM",
    body: "I recently had a minor knee sprain and am unable to walk down to the junction. Help with pickup is needed by 3 PM today. I can reimburse the cost.",
    author: "Maya R.",
    time: "18 min ago",
    color: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    type: "OFFER",
    title:
      "Bosch Power Hammer Drill (500W) & 12ft Folding Aluminum Ladder available for free 24h loan",
    body: "Putting up curtain rods or wall shelving? Don't buy a new drill for a 20-minute job. The kit includes masonry drill bits and a sturdy folding ladder.",
    author: "Rohan S.",
    time: "2 hrs ago",
    color: "bg-secondary-container text-on-secondary-container",
  },
];

function Home() {
  const [leftBarData, setLeftBarData] = useState<LeftBarData>({
    name: "",
    memberSince: "2024",
    level: 0,
    progress: 0,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_BASE_URL}/api/user`,
        );

        if (!response.ok) {
          toast.error("Error fetching your Feed data. Please try again later.");
          return;
        }
        const data = await response.json();
        const leftBarData = {
          name: data.data.name,
          memberSince: new Date(data.data.createdAt).getFullYear().toString(),
          level: 2,
          progress: 0.6,
        };
        setLeftBarData(leftBarData);
      } catch (error) {
        console.error("Error fetching home data:", error);
        toast.error("Error fetching your Feed data. Please try again later.");
      }
    };

    fetchInitialData();
  }, []);
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface-container-low px-3 py-3 ">
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
        <div className="lg:col-span-1">
          <LeftBar leftBarData={leftBarData} />
        </div>

        <section className="min-w-0" aria-label="Community feed">
          <div className="mb-4 rounded-2xl border border-surface-container-high bg-surface p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                AP
              </span>
              <button className="flex h-10 flex-1 items-center justify-between rounded-xl bg-surface-container-low px-4 text-left text-xs text-on-surface-variant">
                <span>
                  Request a helping hand or offer resources in Ward 89...
                </span>
                <Send size={14} className="text-primary" />
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pl-12">
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                <Heart size={12} /> Need help
              </button>
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                <Tag size={12} /> Lend / loan / give
              </button>
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                <Plus size={12} /> Offer service / aid
              </button>
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high px-3 py-1.5 text-[10px] font-bold text-on-surface-variant">
                <MessageCircle size={12} /> Community Discussion / Awareness
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 overflow-x-auto">
            {[
              "All activity",
              "Most recent",
              "Making distance",
              "Open opportunities",
            ].map((filter, index) => (
              <button
                key={filter}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-bold ${
                  index === 0
                    ? "bg-primary text-on-primary"
                    : "bg-surface text-on-surface-variant border border-surface-container-high"
                }`}
              >
                {index === 0 && <Sparkles size={12} />}
                {filter}
                {index === 0 && <ChevronDown size={12} />}
              </button>
            ))}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-base font-bold text-on-surface">
              In your neighborhood
            </h1>
            <button className="text-[10px] font-bold text-primary">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-[10px] font-bold text-on-secondary-container">
                      {post.author.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        {post.author}
                      </p>
                      <p className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                        <Clock3 size={10} /> {post.time} · Indra Nagar
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label="More post options"
                    className="text-on-surface-variant"
                  >
                    <Ellipsis size={17} />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-1 text-[9px] font-bold ${post.color}`}
                  >
                    {post.type}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    Verified community post
                  </span>
                </div>
                <h2 className="mt-2 text-sm font-bold leading-snug text-on-surface">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                  {post.body}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-surface-container-high pt-3">
                  <div className="flex gap-4 text-[10px] font-medium text-on-surface-variant">
                    <button className="flex items-center gap-1">
                      <Heart size={13} /> Support
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle size={13} /> Respond
                    </button>
                    <button className="flex items-center gap-1">
                      <Bookmark size={13} /> Save
                    </button>
                  </div>
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-on-primary">
                    {post.type === "NEED" ? "Offer help" : "Request to borrow"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <RightBar />
      </div>
    </main>
  );
}

export default Home;
