import { FormEvent } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
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
} from "../../types/onboarding-types";
import { toast } from "sonner";

type StepThreeProps = {
  availabilityDetails: AvailabilityDetails;
  onBack: () => void;
  onChange: (details: AvailabilityDetails) => void;
  onComplete: (details: AvailabilityDetails) => void | Promise<void>;
  saving?: boolean;
};

function StepThree({
  availabilityDetails,
  onBack,
  onChange,
  onComplete,
  saving = false,
}: StepThreeProps) {
  const toggleDay = (day: DayOfWeek) => {
    const availabilityDay = availabilityDetails.availabilityDay.includes(day)
      ? availabilityDetails.availabilityDay.filter((item) => item !== day)
      : [...availabilityDetails.availabilityDay, day];
    onChange({ ...availabilityDetails, availabilityDay });
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const geocode = async () => {
          const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

          // Mapbox Geocoding V6 Endpoint
          const url =
            `https://api.mapbox.com/search/geocode/v6/reverse` +
            `?longitude=${longitude}` +
            `&latitude=${latitude}` +
            `&limit=1` +
            `&access_token=${token}`;
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response failure");

            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const feature = data.features[0];
              const label =
                feature.properties?.full_address || feature.properties?.name;
              const coordinates = feature.geometry?.coordinates;

              onChange({
                ...availabilityDetails,
                area: {
                  label: label || "",
                  longitude: coordinates?.[0] ?? longitude,
                  latitude: coordinates?.[1] ?? latitude,
                },
              });
            } else {
              toast.error(
                "Unable to retrieve your location. Please enter it manually.",
              );
            }
          } catch (error) {
            console.error("Error during geocoding:", error);
            toast.error(
              "Unable to retrieve your location. Please enter it manually.",
            );
          }
        };

        void geocode();
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
            onChange={(event) =>
              onChange({
                ...availabilityDetails,
                area: {
                  ...availabilityDetails.area,
                  label: event.target.value,
                },
              })
            }
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
      </label>

      <fieldset className="mt-5">
        <legend className="mb-3 text-sm font-bold text-on-surface">
          When are you usually available?
        </legend>
        <div className="flex flex-wrap gap-2">
          {dayOptions.map(([value, label]) => {
            const selected =
              availabilityDetails.availabilityDay.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleDay(value)}
                aria-label={value}
                aria-pressed={selected}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                  selected
                    ? "border-primary bg-primary text-on-primary"
                    : "border-surface-container-high bg-surface text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 flex flex-col gap-2 text-sm font-bold text-on-surface">
        Typical time
        <span className="relative">
          <Clock3
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <select
            value={availabilityDetails.availabilityTime}
            onChange={(event) =>
              onChange({
                ...availabilityDetails,
                availabilityTime: event.target.value,
              })
            }
            className="w-full appearance-none rounded-xl border border-surface-container-high bg-surface px-10 py-2.5 text-sm font-normal text-on-surface outline-none transition-colors focus:border-primary"
          >
            <option value="">Select a time</option>
            <option value="mornings">Mornings</option>
            <option value="afternoons">Afternoons</option>
            <option value="evenings">Evenings</option>
            <option value="weekends">Mostly weekends</option>
            <option value="flexible">It varies</option>
          </select>
        </span>
      </label>

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
            availabilityDetails.availabilityDay.length === 0
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
