import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Check,
  ImagePlus,
  MapPin,
  MessageCircle,
  Send,
  Tag,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import LeftBar from "../../components/main/LeftBar";
import { useAuth } from "../../context/AuthContext";

const postTypes = [
  { value: "COMMUNITY", label: "Community discussion" },
  { value: "LOOKING_FOR_HELP", label: "Looking for help" },
  { value: "OFFERING_HELP", label: "Offering help" },
  { value: "BORROW", label: "Borrow" },
  { value: "LEND", label: "Lend" },
  { value: "SHARE", label: "Share" },
  { value: "CONTRIBUTE", label: "Contribute" },
  { value: "ORGANIZE", label: "Organize" },
] as const;

type PostType = (typeof postTypes)[number]["value"];

function NewPost() {
  const { user } = useAuth();
  const [postType, setPostType] = useState<PostType>("COMMUNITY");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState(user?.location?.areaLabel ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "KN";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface-container-low px-3 py-4 sm:px-6">
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <LeftBar
          leftBarData={{
            name: user?.name ?? "Neighbor",
            memberSince: "2024",
            level: 0,
            progress: 0,
          }}
        />

        <section className="min-w-0">
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-surface-container-high bg-surface shadow-sm">
              <div className="flex items-center gap-3 border-b border-surface-container-high px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                  {initials}
                </span>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-on-surface">
                    Create a post
                  </h1>
                  <p className="text-[11px] text-on-surface-variant">
                    Share something with your neighborhood
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 border-b border-surface-container-high px-4 py-2.5">
                  <Tag size={15} className="shrink-0 text-primary" />
                  <span className="text-[11px] font-bold text-on-surface-variant">
                    Post type
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isTypeMenuOpen}
                      onClick={() => setIsTypeMenuOpen((isOpen) => !isOpen)}
                      className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary-fixed/60 px-3 text-[11px] font-bold text-primary transition-colors hover:bg-primary-fixed focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {
                        postTypes.find((option) => option.value === postType)
                          ?.label
                      }
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${
                          isTypeMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isTypeMenuOpen && (
                      <div
                        role="listbox"
                        aria-label="Post type"
                        className="absolute left-0 top-10 z-20 grid w-[min(21rem,calc(100vw-3rem))] grid-cols-2 gap-1.5 rounded-xl border border-surface-container-high bg-surface p-2 shadow-xl"
                      >
                        {postTypes.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={postType === option.value}
                            onClick={() => {
                              setPostType(option.value);
                              setIsTypeMenuOpen(false);
                            }}
                            className={`flex min-h-12 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                              postType === option.value
                                ? "bg-primary-fixed text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-[11px] font-bold">
                                {option.label}
                              </span>
                              <span className="mt-0.5 block text-[9px] opacity-70">
                                {option.value === "COMMUNITY"
                                  ? "Start a conversation"
                                  : option.value === "LOOKING_FOR_HELP"
                                  ? "Ask your neighbors"
                                  : option.value === "OFFERING_HELP"
                                  ? "Offer your support"
                                  : option.value === "BORROW"
                                  ? "Ask to use something"
                                  : option.value === "LEND"
                                  ? "Loan something useful"
                                  : option.value === "SHARE"
                                  ? "Give something away"
                                  : option.value === "CONTRIBUTE"
                                  ? "Add to a cause"
                                  : "Bring people together"}
                              </span>
                            </span>
                            {postType === option.value && (
                              <Check size={14} className="shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Add a clear title to your post"
                    className="w-full border-0 bg-transparent text-lg font-bold text-on-surface outline-none placeholder:text-on-surface-variant/50"
                  />
                  <textarea
                    required
                    maxLength={600}
                    rows={6}
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    placeholder="Add more details, timing, or context..."
                    className="mt-3 w-full resize-none border-0 bg-transparent text-sm leading-6 text-on-surface outline-none placeholder:text-on-surface-variant/60"
                  />

                  {imagePreview && (
                    <div className="relative mb-3 overflow-hidden rounded-xl border border-surface-container-high">
                      <img
                        src={imagePreview}
                        alt="Selected post preview"
                        className="max-h-64 w-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove selected image"
                        onClick={() => setImage(null)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-on-surface/75 text-surface hover:bg-on-surface"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 border-t border-surface-container-high pt-3">
                    <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-primary hover:bg-primary-fixed/50">
                      <ImagePlus size={16} />
                      Photo
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <label className="relative inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-on-surface-variant hover:bg-surface-container-low">
                      <MapPin size={15} />
                      <input
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Add location"
                        aria-label="Post location"
                        className="w-28 bg-transparent outline-none placeholder:text-on-surface-variant/70"
                      />
                    </label>
                    <span className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-on-surface-variant">
                      <CalendarDays size={15} />
                      Whenever possible
                    </span>
                    <span className="ml-auto text-[10px] text-on-surface-variant">
                      {details.length}/600
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-surface-container-high bg-surface-container-low/60 px-4 py-3">
                  <p className="hidden items-center gap-1.5 text-[10px] text-on-surface-variant sm:flex">
                    <MessageCircle size={13} />
                    Visible to neighbors in your area
                  </p>
                  <div className="ml-auto flex items-center gap-2">
                    <Link
                      to="/"
                      className="rounded-lg px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Post <Send size={14} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NewPost;
