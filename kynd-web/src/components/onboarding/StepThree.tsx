import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, MapPin, Minus, Plus, ShieldCheck, Target } from "lucide-react";
import {
  LocationDetails,
  PreferenceDetails,
} from "../../types/onboarding-types";
import { toast } from "sonner";
import {
  getLocationsSuggestions,
  reverseGeocodeLocation,
} from "../../services/geoServices.tsx";

type StepThreeProps = {
  locationDetails: LocationDetails;
  preferenceDetails: PreferenceDetails;
  onBack: () => void;
  onChangeLocation: (details: LocationDetails) => void;
  onChangePreferences: (details: PreferenceDetails) => void;
  onComplete: (details: LocationDetails) => void | Promise<void>;
  saving?: boolean;
};

type MatchedLocation = { name: string; lng: number; lat: number };

function StepThree({
  locationDetails,
  preferenceDetails,
  onBack,
  onChangeLocation,
  onChangePreferences,
  onComplete,
  saving = false,
}: StepThreeProps) {
  const [matchedLocations, setMatchedLocations] = useState<MatchedLocation[]>([]);
  const areaDebounceRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (areaDebounceRef.current !== null) {
        window.clearTimeout(areaDebounceRef.current);
      }
    },
    [],
  );

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const label = event.target.value;
    onChangeLocation({ ...locationDetails, label, longitude: null, latitude: null });
    if (areaDebounceRef.current !== null) window.clearTimeout(areaDebounceRef.current);
    if (!label.trim()) {
      setMatchedLocations([]);
      return;
    }
    areaDebounceRef.current = window.setTimeout(async () => {
      try {
        const data = await getLocationsSuggestions(label);
        setMatchedLocations(
          (data.features ?? []).map((feature: any) => ({
            name: feature.place_name,
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1],
          })),
        );
      } catch (error) {
        console.error("Error during geocoding:", error);
        toast.error("Unable to search for that location.");
      }
    }, 350);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void reverseGeocodeLocation(coords.longitude, coords.latitude)
          .then(onChangeLocation)
          .catch((error) => {
            console.error("Error during reverse geocoding:", error);
            toast.error("Unable to retrieve your location.");
          });
      },
      () => toast.error("Unable to retrieve your location."),
    );
  };

  const adjustRadius = (
    key: keyof PreferenceDetails,
    amount: number,
  ) => {
    onChangePreferences({
      ...preferenceDetails,
      [key]: Math.min(50, Math.max(1, preferenceDetails[key] + amount)),
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComplete(locationDetails);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-4xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-2xl sm:p-8 lg:p-9"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <MapPin size={24} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Your local area
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl">
            Where should we look?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-on-surface-variant">
            Set your area and preferred search distances. Your exact location
            stays private.
          </p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold text-on-surface">
        Your area
        <span className="relative flex items-center">
          <MapPin size={17} className="absolute left-3 text-on-surface-variant" />
          <input
            type="text"
            required
            value={locationDetails.label}
            onChange={handleAreaChange}
            placeholder="Neighbourhood, town, or postcode"
            className="w-full rounded-xl border border-surface-container-high bg-surface py-2.5 pl-10 pr-24 text-sm font-normal text-on-surface outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            className="absolute right-2 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary-fixed"
          >
            <Target size={15} /> Locate
          </button>
        </span>
        <ul className="max-h-32 overflow-y-auto rounded-lg bg-surface px-3 text-sm text-on-surface-variant">
          {matchedLocations.map((location) => (
            <li
              key={`${location.lat}-${location.lng}`}
              onClick={() => {
                onChangeLocation({
                  label: location.name,
                  longitude: location.lng,
                  latitude: location.lat,
                });
                setMatchedLocations([]);
              }}
              className="cursor-pointer border-b border-surface-container-high py-2 hover:bg-secondary-fixed/10"
            >
              {location.name}
            </li>
          ))}
        </ul>
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["localityRadius", "For your locality"],
            ["localCommunityRadius", "For your community"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="rounded-2xl border border-surface-container-high bg-surface p-3">
            <p className="text-sm font-bold text-on-surface">{label}</p>
            <p className="mt-1 text-xs leading-5 text-on-surface-variant">
              How far should we look for relevant connections?
            </p>
            <div className="mt-3 flex items-center justify-between">
              <button type="button" onClick={() => adjustRadius(key, -1)} aria-label={`Decrease ${label}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant hover:border-primary hover:text-primary">
                <Minus size={15} />
              </button>
              <span className="text-lg font-black text-primary">{preferenceDetails[key]} km</span>
              <button type="button" onClick={() => adjustRadius(key, 1)} aria-label={`Increase ${label}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant hover:border-primary hover:text-primary">
                <Plus size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-fixed/40 p-3 text-xs leading-5 text-on-surface-variant">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <span>Your location is used to suggest nearby connections. You stay in control of what you share.</span>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface hover:text-on-surface">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="submit"
          disabled={saving || !locationDetails.label.trim() || locationDetails.longitude === null || locationDetails.latitude === null}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-md hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={17} /> {saving ? "Saving..." : "Finish setup"}
        </button>
      </div>
    </form>
  );
}

export default StepThree;
