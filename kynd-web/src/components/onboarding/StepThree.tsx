import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Target,
} from "lucide-react";
import {
  AvailabilityDetails,
  dayOptions,
  DayOfWeek,
  timeOptions,
} from "../../types/onboarding-types";
import { toast } from "sonner";
import {
  getLocationsSuggestions,
  reverseGeocodeLocation,
} from "../../services/geoServices.tsx";

type StepThreeProps = {
  availabilityDetails: AvailabilityDetails;
  onBack: () => void;
  onChange: (details: AvailabilityDetails) => void;
  onComplete: (details: AvailabilityDetails) => void | Promise<void>;
  saving?: boolean;
};

type MatchedLocation = {
  name: string;
  lng: number;
  lat: number;
};

function StepThree({
  availabilityDetails,
  onBack,
  onChange,
  onComplete,
  saving = false,
}: StepThreeProps) {
  const [activeDay, setActiveDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);
  const selectedDays = dayOptions
    .map(([day]) => day)
    .filter((day) => day in availabilityDetails.availability);

  const toggleDay = (day: DayOfWeek) => {
    const availability = { ...availabilityDetails.availability };
    if (day in availability) {
      delete availability[day];
      if (day === activeDay) {
        setActiveDay(
          (Object.keys(availability)[0] as DayOfWeek | undefined) ??
            DayOfWeek.MONDAY,
        );
      }
    } else {
      availability[day] = [];
      setActiveDay(day);
    }
    onChange({ ...availabilityDetails, availability });
  };

  const toggleTime = (day: DayOfWeek, time: string) => {
    const dayTimes = availabilityDetails.availability[day] ?? [];
    const availability = {
      ...availabilityDetails.availability,
      [day]: dayTimes.includes(time)
        ? dayTimes.filter((item) => item !== time)
        : [...dayTimes, time],
    };
    onChange({ ...availabilityDetails, availability });
  };

  const [matchedLocations, setMatchedLocations] = useState<MatchedLocation[]>(
    [],
  );
  const areaDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (areaDebounceRef.current !== null) {
        window.clearTimeout(areaDebounceRef.current);
      }
    };
  }, []);

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLabel = event.target.value;

    onChange({
      ...availabilityDetails,
      area: {
        ...availabilityDetails.area,
        label: nextLabel,
      },
    });

    if (nextLabel.trim().length < 1) {
      setMatchedLocations([]);
      if (areaDebounceRef.current !== null) {
        window.clearTimeout(areaDebounceRef.current);
      }
      return;
    }

    if (areaDebounceRef.current !== null) {
      window.clearTimeout(areaDebounceRef.current);
    }

    areaDebounceRef.current = window.setTimeout(async () => {
      try {
        const data = await getLocationsSuggestions(nextLabel);
        if (data.features && data.features.length > 0) {
          setMatchedLocations(
            data.features.map((f: any) => ({
              name: f.place_name,
              lng: f.geometry.coordinates[0],
              lat: f.geometry.coordinates[1],
            })),
          );
        } else {
          setMatchedLocations([]);
          toast.error(
            "Please enter a more specific location. We couldn't find any matches.",
          );
        }
      } catch (error) {
        console.error("Error during geocoding:", error);
        setMatchedLocations([]);
        toast.error(
          "Please enter a more specific location. We couldn't find any matches.",
        );
      }
    }, 350);
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        void reverseGeocodeLocation(longitude, latitude)
          .then((location) => {
            onChange({
              ...availabilityDetails,
              area: location,
            });
          })
          .catch((error) => {
            console.error("Error during reverse geocoding:", error);
            toast.error(
              "Unable to retrieve your location. Please enter it manually.",
            );
          });
      },
      (error) => {
        console.log(error);
        toast.error(
          "Unable to retrieve your location. Please enter it manually.",
        );
      },
    );
  };

  const adjustRadius = (
    key: "personalHelpRadius" | "communityHelpRadius",
    amount: number,
  ) => {
    const value = Math.min(50, Math.max(1, availabilityDetails[key] + amount));
    onChange({ ...availabilityDetails, [key]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComplete(availabilityDetails);
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
            Your availability
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl">
            Where can you make a difference?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-on-surface-variant">
            Set a rough area and schedule. Exact details stay private until you
            choose to share them.
          </p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold text-on-surface">
        Your area
        <span className="relative flex items-center">
          <MapPin
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            required
            value={availabilityDetails.area.label}
            onChange={handleAreaChange}
            placeholder="Neighbourhood, town, or postcode"
            className="w-full rounded-xl border border-surface-container-high bg-surface py-2.5 pl-10 pr-24 text-sm font-normal text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            aria-label="Use your current location"
            title="Use your current location"
            className="absolute right-2 top-1/2 cursor-pointer flex -translate-y-1/2 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary-fixed focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <Target size={15} />
            <span>Locate</span>
          </button>
        </span>
        <ul className=" max-h-32  overflow-x-hidden overflow-scroll scrollbar-thumb-secondary-fixed-dim scrollbar-track-surface scrollbar-thumb-rounded-full scrollbar-track-rounded-full rounded-lg  bg-surface  px-3 text-sm text-on-surface-variant">
          {matchedLocations.length > 0 &&
            matchedLocations.map((location) => (
              <li
                key={`${location.lat}-${location.lng}`}
                onClick={(event) => {
                  event.preventDefault();
                  onChange({
                    ...availabilityDetails,
                    area: {
                      label: location.name,
                      longitude: location.lng,
                      latitude: location.lat,
                    },
                  });
                  setMatchedLocations([]);
                }}
                className="text-sm cursor-pointer border-b border-surface-container-high py-2 hover:bg-secondary-fixed/10 text-on-surface-variant"
              >
                {location.name}
              </li>
            ))}
        </ul>
      </label>

      <fieldset className="mt-5">
        <legend className="mb-3 text-sm font-bold text-on-surface">
          When are you usually available?
        </legend>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map(([value, label]) => {
            const selected = selectedDays.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setActiveDay(value);
                  toggleDay(value);
                }}
                aria-label={value}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors ${
                  selected
                    ? "border-primary bg-primary text-on-primary"
                    : "border-surface-container-high bg-surface text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {label.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-4 rounded-2xl border border-surface-container-high bg-surface p-3">
        <legend className="px-1 text-sm font-bold text-on-surface">
          Times for{" "}
          {dayOptions.find(([day]) => day === activeDay)?.[1] ?? "this day"}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {timeOptions.map(([time, label]) => {
            const selected =
              availabilityDetails.availability[activeDay]?.includes(time) ??
              false;
            return (
              <button
                key={time}
                type="button"
                onClick={() => toggleTime(activeDay, time)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors ${
                  selected
                    ? "border-primary bg-primary text-on-primary"
                    : "border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">
          Select a day above to edit its times.
        </p>
      </fieldset>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(["personalHelpRadius", "communityHelpRadius"] as const).map((key) => {
          const isPersonal = key === "personalHelpRadius";
          return (
            <div
              key={key}
              className="rounded-2xl border border-surface-container-high bg-surface p-3"
            >
              <p className="text-sm font-bold text-on-surface">
                {isPersonal ? "For your own needs" : "For community support"}
              </p>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                How far should we look for relevant connections?
              </p>
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => adjustRadius(key, -1)}
                  aria-label={`Decrease ${key}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  <Minus size={15} />
                </button>
                <span className="text-lg font-black text-primary">
                  {availabilityDetails[key]} km
                </span>
                <button
                  type="button"
                  onClick={() => adjustRadius(key, 1)}
                  aria-label={`Increase ${key}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-fixed/40 p-3 text-xs leading-5 text-on-surface-variant">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <span>
          Your location is used to suggest nearby connections. You stay in
          control of what you share.
        </span>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface hover:text-on-surface"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="submit"
          disabled={
            saving ||
            !availabilityDetails.area.label.trim() ||
            availabilityDetails.area.longitude === null ||
            availabilityDetails.area.latitude === null ||
            selectedDays.length === 0 ||
            selectedDays.every(
              (day) =>
                (availabilityDetails.availability[day]?.length ?? 0) === 0,
            )
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={17} /> {saving ? "Saving..." : "Finish setup"}
        </button>
      </div>
    </form>
  );
}

export default StepThree;
