import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Check,
  X,
  ImagePlus,
  MapPin,
  MessageCircle,
  Send,
  Tag,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api-client.ts";
import {
  getLocationsSuggestions,
  type GeocodingFeature,
} from "../../../services/geoServices.tsx";
import { POST_TYPES, type PostType } from "../../../types/post-types.ts";
import { toast } from "../../../lib/toast.ts";
type ScheduleType = "FLEXIBLE" | "STARTS_AT" | "TIME_RANGE";

const scheduleByPostType: Record<
  PostType,
  { type: ScheduleType; required: boolean; label: string }
> = {
  COMMUNITY: { type: "FLEXIBLE", required: false, label: "" },
  LOOKING_FOR_HELP: {
    type: "STARTS_AT",
    required: true,
    label: "When do you need help?",
  },
  OFFERING_HELP: {
    type: "STARTS_AT",
    required: true,
    label: "When are you available?",
  },
  BORROW: {
    type: "TIME_RANGE",
    required: true,
    label: "When do you need it?",
  },
  LEND: {
    type: "TIME_RANGE",
    required: true,
    label: "When is it available?",
  },
  SHARE: {
    type: "TIME_RANGE",
    required: false,
    label: "Available now or until",
  },
  CONTRIBUTE: {
    type: "STARTS_AT",
    required: true,
    label: "When is the contribution needed?",
  },
  ORGANIZE: {
    type: "STARTS_AT",
    required: true,
    label: "Date and time of activity",
  },
};

type NewPostProps = {
  open: boolean;
  onClose: () => void;
};

function NewPost({ open, onClose }: NewPostProps) {
  const { user } = useAuth();
  const [postType, setPostType] = useState<PostType>("COMMUNITY");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [locationLabel, setLocationLabel] = useState(
    user?.location?.areaLabel ?? "",
  );
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    GeocodingFeature[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GeocodingFeature | null>(null);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const scheduleConfig = scheduleByPostType[postType];
  const locationDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (locationDebounceRef.current !== null) {
      window.clearTimeout(locationDebounceRef.current);
    }

    if (!locationQuery.trim()) {
      setLocationSuggestions([]);
      return;
    }

    locationDebounceRef.current = window.setTimeout(async () => {
      const result = await getLocationsSuggestions(locationQuery.trim());
      setLocationSuggestions(result.features.slice(0, 5));
    }, 300);

    return () => {
      if (locationDebounceRef.current !== null) {
        window.clearTimeout(locationDebounceRef.current);
      }
    };
  }, [locationQuery]);

  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }
    const previewUrls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    return () =>
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
  }, [images]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length > 0) {
      setImages((currentImages) => [...currentImages, ...selectedFiles]);
    }
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.warning("Please fill in both the title and content fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("postType", postType);
      const submittedLocationLabel = (
        selectedLocation?.place_name || locationLabel
      ).trim();
      if (submittedLocationLabel) {
        formData.append("locationLabel", submittedLocationLabel);
      }
      if (selectedLocation) {
        formData.append(
          "locationLongitude",
          selectedLocation.geometry.coordinates[0].toString(),
        );
        formData.append(
          "locationLatitude",
          selectedLocation.geometry.coordinates[1].toString(),
        );
      }
      if (scheduleConfig.type !== "FLEXIBLE") {
        formData.append("scheduleType", scheduleConfig.type);
        if (startsAt) {
          formData.append("scheduleStartDate", startsAt);
        }
        if (endsAt) {
          formData.append("scheduleEndDate", endsAt);
        }
      }
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/posts`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast.success("Post created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "KN";

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-on-surface/45 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-surface-container-high bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-surface-container-high px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
            {initials}
          </span>
          <div className="min-w-0">
            <h1
              id="new-post-title"
              className="text-sm font-bold text-on-surface"
            >
              Create a post
            </h1>
            <p className="text-[11px] text-on-surface-variant">
              Share something with your neighborhood
            </p>
          </div>
          <button
            type="button"
            aria-label="Close new post dialog"
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          >
            <X size={17} />
          </button>
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
                className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary-fixed/60 px-3 text-[11px] font-bold text-primary transition-colors hover:bg-primary-fixed "
              >
                {POST_TYPES.find((option) => option.value === postType)?.label}
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
                  {POST_TYPES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={postType === option.value}
                      onClick={() => {
                        setPostType(option.value);
                        setStartsAt("");
                        setEndsAt("");
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
                        <span className="mt-0.5 block text-xs opacity-80">
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
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add a clear title to your post"
              className="w-full border-0 bg-transparent text-lg font-bold text-on-surface outline-none placeholder:text-on-surface-variant/50"
            />
            <textarea
              required
              maxLength={2000}
              rows={10}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Add more details, timing, or context..."
              className="mt-3 overflow-auto scrollbar-thin w-full resize-none border-0 bg-transparent text-sm leading-6 text-on-surface outline-none placeholder:text-on-surface-variant/60"
            />

            {imagePreviews.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative overflow-hidden rounded-xl border border-surface-container-high"
                  >
                    <img
                      src={preview}
                      alt={`Selected image ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-on-surface/75 text-surface hover:bg-on-surface"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-surface-container-high pt-3">
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-primary hover:bg-primary-fixed/50">
                <ImagePlus size={16} />
                Photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <div className="relative">
                <div className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-on-surface-variant focus-within:bg-surface-container-low">
                  <MapPin size={15} className="shrink-0 text-primary" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(event) => {
                      setLocationQuery(event.target.value);
                      setSelectedLocation(null);
                      setLocationLabel(event.target.value);
                    }}
                    placeholder={locationLabel || "Add location"}
                    aria-label="Search for post location"
                    className="w-40 bg-transparent outline-none placeholder:text-on-surface-variant/70"
                  />
                  {locationQuery && (
                    <button
                      type="button"
                      aria-label="Clear location search"
                      onClick={() => {
                        setLocationQuery("");
                        setLocationLabel("");
                        setSelectedLocation(null);
                      }}
                      className="text-on-surface-variant hover:text-on-surface"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                {locationSuggestions.length > 0 && (
                  <ul className="absolute left-0 top-10 z-30 w-72 overflow-hidden rounded-xl border border-surface-container-high bg-surface shadow-xl">
                    {locationSuggestions.map((suggestion) => (
                      <li key={suggestion.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocation(suggestion);
                            setLocationLabel(suggestion.place_name);
                            setLocationQuery("");
                            setLocationSuggestions([]);
                          }}
                          className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-xs text-on-surface hover:bg-surface-container-low"
                        >
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <span>{suggestion.place_name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className="ml-auto text-[10px] text-on-surface-variant">
                {content.length}/2000
              </span>
            </div>
            {scheduleConfig.type !== "FLEXIBLE" && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-[10px] font-bold text-on-surface-variant">
                  {scheduleConfig.type === "TIME_RANGE"
                    ? "Starts at"
                    : scheduleConfig.label}
                  <input
                    required={scheduleConfig.required}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                    className="mt-1 h-9 w-full rounded-lg border border-surface-container-high bg-surface-container-low px-3 text-xs font-normal text-on-surface outline-none focus:border-primary"
                  />
                </label>
                {scheduleConfig.type === "TIME_RANGE" && (
                  <label className="text-[10px] font-bold text-on-surface-variant">
                    Duration ends at
                    <input
                      required={scheduleConfig.required}
                      type="datetime-local"
                      value={endsAt}
                      onChange={(event) => setEndsAt(event.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-surface-container-high bg-surface-container-low px-3 text-xs font-normal text-on-surface outline-none focus:border-primary"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-surface-container-high bg-surface-container-low/60 px-4 py-3">
            <p className="hidden items-center gap-1.5 text-[10px] text-on-surface-variant sm:flex">
              <MessageCircle size={13} />
              Visible to neighbors in your area
            </p>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Post <Send size={14} />
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NewPost;
