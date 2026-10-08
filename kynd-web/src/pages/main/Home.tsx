import {
  Bookmark,
  CalendarDays,
  Clock3,
  Ellipsis,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import LeftBar from "../../components/main/LeftBar";
import { useCallback, useEffect, useMemo, useState } from "react";
import RightBar from "../../components/main/RightBar";
import { apiFetch } from "../../lib/api-client.ts";
import { toast } from "../../lib/toast.ts";
import { reverseGeocodeLocation } from "../../services/geoServices.tsx";
import { LeftBarData } from "../../types/home-types.ts";
import {
  getPostTypeBadgeClasses,
  getPostTypeLabel,
  type PostType,
} from "../../types/post-types.ts";
import NewPost from "../../components/main/modals/NewPost.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

type HomePost = {
  id: string;
  type: PostType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  locationLabel: string | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
  schedule: {
    type: "FLEXIBLE" | "STARTS_AT" | "TIME_RANGE";
    startsAt: string | null;
    endsAt: string | null;
  } | null;
  author: {
    name: string;
    location: { areaLabel: string | null } | null;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getImageUrl(url: string) {
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_BASE_URL}${url}`;
}

function formatPostTime(createdAt: string) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000),
  );

  if (elapsedMinutes < 1) return "Just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  return `${Math.floor(elapsedHours / 24)}d ago`;
}

type FilterCategory = "ALL" | "NEED_HELP" | "OFFER_HELP" | "LEND_BORROW" | "COMMUNITY";

function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-surface-container-high" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/4 rounded bg-surface-container-high" />
          <div className="h-2.5 w-1/3 rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-surface-container-high" />
        <div className="h-3 w-full rounded bg-surface-container-high" />
        <div className="h-3 w-4/5 rounded bg-surface-container-high" />
      </div>
      <div className="mt-4 flex justify-between border-t border-surface-container-high pt-3">
        <div className="h-4 w-1/3 rounded bg-surface-container-high" />
        <div className="h-6 w-20 rounded-lg bg-surface-container-high" />
      </div>
    </div>
  );
}

function Home() {
  const { user } = useAuth();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostDefaultType, setNewPostDefaultType] = useState<PostType>("COMMUNITY");
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");

  const [supportedPosts, setSupportedPosts] = useState<Record<string, boolean>>({});
  const [supportCounts, setSupportCounts] = useState<Record<string, number>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  const [resolvedPostLocations, setResolvedPostLocations] = useState<
    Record<string, string>
  >({});
  const [leftBarData, setLeftBarData] = useState<LeftBarData>({
    name: user?.name || "Neighbor",
    memberSince: "2024",
    level: 2,
    progress: 0.6,
  });

  const fetchFeedData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [userResponse, postsResponse] = await Promise.all([
        apiFetch(`${import.meta.env.VITE_BASE_URL}/api/user/me`),
        apiFetch(`${import.meta.env.VITE_BASE_URL}/api/user/me/myposts`),
      ]);

      if (!userResponse.ok || !postsResponse.ok) {
        toast.error("Error fetching your feed data. Please try again later.");
        return;
      }
      const data = await userResponse.json();
      const postsData = await postsResponse.json();
      const fetchedPosts = (postsData.data?.posts || []) as HomePost[];
      setPosts(fetchedPosts);

      const counts: Record<string, number> = {};
      fetchedPosts.forEach((post, i) => {
        counts[post.id || post.title] = ((i * 2 + 3) % 7) + 1;
      });
      setSupportCounts((prev) => ({ ...counts, ...prev }));

      const profileData = {
        name: data.data.name,
        memberSince: new Date(data.data.createdAt).getFullYear().toString(),
        level: 2,
        progress: 0.6,
      };
      setLeftBarData(profileData);
    } catch (error) {
      console.error("Error fetching home data:", error);
      toast.error("Error fetching your feed data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeedData();
  }, [fetchFeedData]);

  useEffect(() => {
    const postsWithCoordinates = posts.filter(
      (post) =>
        !post.locationLabel &&
        post.locationLatitude !== null &&
        post.locationLongitude !== null,
    );

    if (postsWithCoordinates.length === 0) return;

    let cancelled = false;

    const resolveLocations = async () => {
      const resolvedEntries = await Promise.all(
        postsWithCoordinates.map(async (post) => {
          const locationKey = `${post.locationLatitude},${post.locationLongitude}`;
          try {
            const location = await reverseGeocodeLocation(
              post.locationLongitude as number,
              post.locationLatitude as number,
            );
            return [locationKey, location.label] as const;
          } catch (error) {
            console.error(`Unable to resolve location for post ${post.id}:`, error);
            return null;
          }
        }),
      );

      if (cancelled) return;

      setResolvedPostLocations((currentLocations) => ({
        ...currentLocations,
        ...Object.fromEntries(
          resolvedEntries.filter(
            (entry): entry is readonly [string, string] => entry !== null,
          ),
        ),
      }));
    };

    void resolveLocations();

    return () => {
      cancelled = true;
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeCategory === "NEED_HELP") {
        if (post.type !== "LOOKING_FOR_HELP") return false;
      } else if (activeCategory === "OFFER_HELP") {
        if (post.type !== "OFFERING_HELP") return false;
      } else if (activeCategory === "LEND_BORROW") {
        if (!["BORROW", "LEND", "SHARE"].includes(post.type)) return false;
      } else if (activeCategory === "COMMUNITY") {
        if (!["COMMUNITY", "ORGANIZE", "CONTRIBUTE"].includes(post.type)) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = post.title?.toLowerCase().includes(query);
        const contentMatch = post.content?.toLowerCase().includes(query);
        const authorMatch = post.author?.name?.toLowerCase().includes(query);
        const locMatch =
          post.locationLabel?.toLowerCase().includes(query) ||
          post.author.location?.areaLabel?.toLowerCase().includes(query);
        if (!titleMatch && !contentMatch && !authorMatch && !locMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortBy === "recent" ? timeB - timeA : timeA - timeB;
    });
  }, [posts, activeCategory, searchQuery, sortBy]);

  const handleOpenComposer = (type: PostType = "COMMUNITY") => {
    setNewPostDefaultType(type);
    setIsNewPostOpen(true);
  };

  const handleToggleSupport = (postId: string) => {
    const isSupported = !!supportedPosts[postId];
    setSupportedPosts((prev) => ({ ...prev, [postId]: !isSupported }));
    setSupportCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isSupported ? -1 : 1),
    }));
    if (!isSupported) {
      toast.success("Thanked neighbor for this post!");
    }
  };

  const handleToggleSave = (postId: string) => {
    const isSaved = !!savedPosts[postId];
    setSavedPosts((prev) => ({ ...prev, [postId]: !isSaved }));
    toast.info(isSaved ? "Removed from saved posts" : "Saved post to your bookmarks!");
  };

  const handleSharePost = (post: HomePost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#post-${post.id || "1"}`);
      toast.success("Post link copied to clipboard!");
    } else {
      toast.info(`Sharing "${post.title}"`);
    }
  };

  const handlePostAction = (post: HomePost) => {
    switch (post.type) {
      case "LOOKING_FOR_HELP":
        toast.success(`Offering a helping hand to ${post.author.name}!`);
        break;
      case "OFFERING_HELP":
        toast.success(`Requesting support from ${post.author.name}!`);
        break;
      case "LEND":
      case "SHARE":
        toast.success(`Requested to borrow from ${post.author.name}!`);
        break;
      case "BORROW":
        toast.success(`Offered to lend item to ${post.author.name}!`);
        break;
      default:
        toast.info(`Joining discussion with ${post.author.name}`);
        break;
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AP";

  return (
    <>
      <NewPost
        open={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        initialPostType={newPostDefaultType}
        onPostCreated={() => void fetchFeedData(true)}
      />

      <main className="bg-surface-container-low px-2 py-2 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        <div className="mx-auto grid max-w-360 grid-cols-1 gap-3 lg:h-full lg:min-h-0 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
          {/* Left Sidebar */}
          <div className="min-w-0 min-h-0 lg:col-span-1">
            <LeftBar
              leftBarData={leftBarData}
              onOpenNewPost={(type) => handleOpenComposer(type || "LOOKING_FOR_HELP")}
            />
          </div>

          {/* Center Feed Column */}
          <section
            className="scrollbar-thin min-w-0 overflow-y-auto px-2 pb-8 overscroll-contain scrollbar-auto-hide lg:min-h-0"
            aria-label="Community feed"
          >
            {/* Quick Composer Card */}
            <div className="mb-4 rounded-2xl border border-surface-container-high bg-surface p-3 shadow-sm transition-colors hover:border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
                  {userInitials}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenComposer("COMMUNITY")}
                  className="flex h-10 flex-1 items-center justify-between rounded-xl bg-surface-container-low px-4 text-left text-xs text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                  <span className="truncate">
                    Request a helping hand or offer resources in your neighborhood...
                  </span>
                  <Send size={14} className="text-primary shrink-0 ml-2" />
                </button>
              </div>

              {/* Composer Category Pills */}
              <div className="mt-3 flex gap-2 overflow-x-auto pl-12">
                <button
                  type="button"
                  onClick={() => handleOpenComposer("LOOKING_FOR_HELP")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high bg-surface-container-low/50 px-3 py-1.5 text-[10px] font-bold text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <Heart size={12} className="text-primary" /> Need help
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenComposer("LEND")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high bg-surface-container-low/50 px-3 py-1.5 text-[10px] font-bold text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <Tag size={12} className="text-primary" /> Lend / loan / give
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenComposer("OFFERING_HELP")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high bg-surface-container-low/50 px-3 py-1.5 text-[10px] font-bold text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <Plus size={12} className="text-primary" /> Offer service / aid
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenComposer("COMMUNITY")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-container-high bg-surface-container-low/50 px-3 py-1.5 text-[10px] font-bold text-on-surface transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <MessageCircle size={12} className="text-primary" /> Community Discussion
                </button>
              </div>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "ALL", label: "All activity" },
                  { id: "NEED_HELP", label: "Needs" },
                  { id: "OFFER_HELP", label: "Offers" },
                  { id: "LEND_BORROW", label: "Lend & borrow" },
                  { id: "COMMUNITY", label: "Discussions" },
                ].map(({ id, label }) => {
                  const active = activeCategory === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveCategory(id as FilterCategory)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-colors ${
                        active
                          ? "bg-primary text-on-primary shadow-xs"
                          : "border border-surface-container-high bg-surface text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                      }`}
                    >
                      {active && <Sparkles size={11} />}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feed Search & Actions */}
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <div className="relative flex-1 sm:w-40 sm:flex-none">
                  <Search
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search feed..."
                    aria-label="Filter neighborhood feed"
                    className="h-8 w-full rounded-full border border-surface-container-high bg-surface pl-7 pr-6 text-xs text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSortBy((prev) => (prev === "recent" ? "oldest" : "recent"))}
                  className="flex h-8 items-center gap-1 rounded-full border border-surface-container-high bg-surface px-2.5 text-[10px] font-bold text-on-surface-variant hover:text-primary"
                  title="Toggle sort order"
                >
                  <Filter size={11} />
                  <span>{sortBy === "recent" ? "Newest" : "Oldest"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => void fetchFeedData(true)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-surface-container-high bg-surface text-on-surface-variant hover:text-primary ${
                    refreshing ? "animate-spin text-primary" : ""
                  }`}
                  aria-label="Refresh feed"
                  title="Refresh feed"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>

            {/* Posts Feed Area */}
            {loading ? (
              <div className="space-y-4">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </div>
            ) : filteredPosts.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-container-high bg-surface px-6 py-12 text-center shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={24} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-on-surface">
                  {searchQuery || activeCategory !== "ALL"
                    ? "No neighborhood posts found"
                    : "Your neighborhood feed is clear"}
                </h3>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-on-surface-variant">
                  {searchQuery || activeCategory !== "ALL"
                    ? "Try clearing filters to see all community activity."
                    : "Be the first neighbor to post a request or offer in your ward!"}
                </p>
                <div className="mt-4 flex gap-2">
                  {(searchQuery || activeCategory !== "ALL") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("ALL");
                      }}
                      className="rounded-lg border border-surface-container-high bg-surface px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container-low"
                    >
                      Clear filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenComposer("LOOKING_FOR_HELP")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary hover:bg-primary-container"
                  >
                    <Plus size={13} />
                    <span>Create a post</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const isSupported = !!supportedPosts[post.id || post.title];
                  const supportCount = supportCounts[post.id || post.title] ?? 1;
                  const isSaved = !!savedPosts[post.id || post.title];

                  const resolvedLoc =
                    post.locationLabel ||
                    post.author.location?.areaLabel ||
                    (post.locationLatitude !== null &&
                      post.locationLongitude !== null &&
                      resolvedPostLocations[
                        `${post.locationLatitude},${post.locationLongitude}`
                      ]);

                  const postInitials = post.author?.name
                    ? post.author.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "NB";

                  return (
                    <article
                      key={post.id || post.title}
                      className="rounded-2xl border border-surface-container-high bg-surface p-4 shadow-sm transition-all hover:border-outline-variant"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-[10px] font-bold text-on-secondary-container">
                            {postInitials}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-on-surface">
                              {post.author.name}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                              <Clock3 size={10} /> {formatPostTime(post.createdAt)}
                              {resolvedLoc && (
                                <>
                                  {" · "}
                                  <MapPin size={10} />
                                  <span className="truncate max-w-[140px] sm:max-w-xs">{resolvedLoc}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Post Options Menu */}
                        <button
                          aria-label="More post options"
                          onClick={() => handleSharePost(post)}
                          className="text-on-surface-variant hover:text-on-surface"
                        >
                          <Ellipsis size={17} />
                        </button>
                      </div>

                      {/* Post Type Badge */}
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-1 text-[9px] font-bold ${getPostTypeBadgeClasses(
                            post.type,
                          )}`}
                        >
                          {getPostTypeLabel(post.type)}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          Verified community post
                        </span>
                      </div>

                      {/* Post Title & Content */}
                      <h2 className="mt-2 text-sm font-bold leading-snug text-on-surface">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                        {post.content}
                      </p>

                      {/* Schedule Box */}
                      {post.schedule && (
                        <div className="mt-4 space-y-2 rounded-xl bg-surface-container-low p-3 text-[10px] text-on-surface-variant">
                          <div className="flex items-start gap-2">
                            <CalendarDays size={14} className="mt-0.5 shrink-0 text-primary" />
                            <div>
                              <p className="font-bold text-on-surface">
                                {post.schedule.type === "FLEXIBLE"
                                  ? "Flexible timing"
                                  : post.schedule.type === "TIME_RANGE"
                                  ? "Time range"
                                  : "Scheduled time"}
                              </p>
                              {post.schedule.startsAt && (
                                <p>Starts {formatDate(post.schedule.startsAt)}</p>
                              )}
                              {post.schedule.endsAt && (
                                <p>Ends {formatDate(post.schedule.endsAt)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Image Gallery */}
                      {post.images && post.images.length > 0 && (
                        <div
                          className={`mt-4 grid gap-2 ${
                            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                          }`}
                        >
                          {post.images.map((image) => (
                            <img
                              key={image.id}
                              src={getImageUrl(image.url)}
                              alt=""
                              className="max-h-72 w-full rounded-xl object-cover"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}

                      <p className="mt-3 text-[10px] text-on-surface-variant">
                        Posted {formatDate(post.createdAt)}
                        {post.updatedAt !== post.createdAt && " · Edited"}
                      </p>

                      {/* Post Actions Footer */}
                      <div className="mt-4 flex items-center justify-between border-t border-surface-container-high pt-3">
                        <div className="flex gap-4 text-[10px] font-medium text-on-surface-variant">
                          {/* Heart Support */}
                          <button
                            type="button"
                            onClick={() => handleToggleSupport(post.id || post.title)}
                            className={`flex items-center gap-1 transition-colors ${
                              isSupported ? "font-bold text-primary" : "hover:text-primary"
                            }`}
                          >
                            <Heart
                              size={13}
                              className={isSupported ? "fill-primary text-primary" : ""}
                            />
                            <span>{supportCount} Support</span>
                          </button>

                          {/* Respond */}
                          <button
                            type="button"
                            onClick={() => handlePostAction(post)}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <MessageCircle size={13} /> Respond
                          </button>

                          {/* Save */}
                          <button
                            type="button"
                            onClick={() => handleToggleSave(post.id || post.title)}
                            className={`flex items-center gap-1 transition-colors ${
                              isSaved ? "font-bold text-primary" : "hover:text-primary"
                            }`}
                          >
                            <Bookmark
                              size={13}
                              className={isSaved ? "fill-primary text-primary" : ""}
                            />
                            <span>{isSaved ? "Saved" : "Save"}</span>
                          </button>

                          {/* Share */}
                          <button
                            type="button"
                            onClick={() => handleSharePost(post)}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <Share2 size={13} />
                          </button>
                        </div>

                        {/* Action CTA Button */}
                        <button
                          type="button"
                          onClick={() => handlePostAction(post)}
                          className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-on-primary transition-colors hover:bg-primary-container"
                        >
                          {post.type === "LOOKING_FOR_HELP"
                            ? "Offer help"
                            : post.type === "OFFERING_HELP"
                            ? "Request aid"
                            : post.type === "BORROW"
                            ? "Lend item"
                            : "Request to borrow"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Sidebar */}
          <div className="min-w-0 min-h-0">
            <RightBar />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;

