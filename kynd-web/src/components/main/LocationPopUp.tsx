import { MapPin, Navigation, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { apiFetch } from "../../lib/api-client.ts";
import {
  getLocationsSuggestions,
  reverseGeocodeLocation,
  type GeocodingFeature,
} from "../../services/geoServices.tsx";
import { toast } from "sonner";

function LocationPopUp({
  open,
  onClose,
  onLocationSaved,
}: {
  open: boolean;
  onClose: () => void;
  onLocationSaved: () => void;
}) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSuggestions([]);
  }, [open]);

  useEffect(() => {
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const result = await getLocationsSuggestions(query.trim());
      setSuggestions(result.features.slice(0, 5));
    }, 300);

    return () => {
      if (debounceRef.current !== null)
        window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  async function saveLocation(
    label: string,
    longitude: number,
    latitude: number,
  ) {
    setSaving(true);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/location`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, longitude, latitude }),
        },
      );
      if (!response.ok) throw new Error("Unable to save location");
      onLocationSaved();
    } catch (error) {
      console.error("Location update error:", error);
      toast.error("Unable to update your location. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const location = await reverseGeocodeLocation(
            coords.longitude,
            coords.latitude,
          );
          await saveLocation(
            location.label,
            location.longitude,
            location.latitude,
          );
        } catch (error) {
          console.error("Current location error:", error);
          toast.error("Unable to determine your current location.");
        }
      },
      () => toast.error("Unable to access your current location."),
    );
  }

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    open && (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/35 p-3 backdrop-blur-sm sm:items-center sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-dialog-title"
          className="w-full max-w-lg overflow-hidden rounded-3xl  bg-surface-container-lowest shadow-2xl"
        >
          <div className="bg-primary px-5 py-5 text-on-primary sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  <MapPin size={21} />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary-fixed">
                    Your community
                  </p>
                  <h2
                    id="location-dialog-title"
                    className="mt-1 text-xl font-extrabold tracking-tight"
                  >
                    Where are you based?
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close location dialog"
                className="rounded-full p-2 text-on-primary/75 transition-colors hover:bg-on-primary/10 hover:text-on-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed"
              >
                <X size={19} />
              </button>
            </div>
            <p className="mt-4 max-w-md text-sm leading-5 text-on-primary/80">
              Choose your neighborhood to see relevant help and offers nearby.
            </p>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary-fixed/35 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
                <MapPin size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Current location
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-on-surface">
                  {user?.location?.areaLabel || "No location selected yet"}
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-xs font-bold text-on-surface"
              >
                Search for a place
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="Neighborhood, town, or postcode"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  disabled={saving}
                  className="h-12 w-full rounded-2xl border border-surface-container-high bg-surface-container-low pl-10 pr-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/70 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                />
              </div>
              {suggestions.length > 0 && (
                <ul className="mt-2 overflow-hidden rounded-2xl border border-surface-container-high bg-surface">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.id}>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void saveLocation(
                            suggestion.place_name,
                            suggestion.geometry.coordinates[0],
                            suggestion.geometry.coordinates[1],
                          )
                        }
                        className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-on-surface transition-colors hover:bg-surface-container-low"
                      >
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-primary"
                        />
                        <span>{suggestion.place_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={useCurrentLocation}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary-fixed/55 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-fixed focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <Navigation size={17} />
              {saving ? "Updating location..." : "Use my current location"}
            </button>

            <p className="flex items-start gap-2 border-t border-surface-container-high pt-4 text-xs leading-5 text-on-surface-variant">
              <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
              Your exact address stays private. We only use your area to
              personalize nearby recommendations.
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default LocationPopUp;
