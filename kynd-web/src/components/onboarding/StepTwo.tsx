import { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  HandHelping,
  HeartHandshake,
  Megaphone,
  Search,
  Users,
} from "lucide-react";
import {
  IntentDetails,
  IntentType,
  OfferType,
} from "../../types/onboarding-types";

type StepTwoProps = {
  intentDetails: IntentDetails;
  onBack: () => void;
  onChange: (details: IntentDetails) => void;
  onContinue: (details: IntentDetails) => void;
};

const intentOptions = [
  { value: IntentType.LOOKING_FOR_HELP, label: "Find support", icon: Search },
  {
    value: IntentType.OFFERING_HELP,
    label: "Offer support",
    icon: HandHelping,
  },
  {
    value: IntentType.CONTRIBUTE,
    label: "Contribute locally",
    icon: HeartHandshake,
  },
  { value: IntentType.ORGANIZE, label: "Organize people", icon: Megaphone },
  { value: IntentType.JUST_BROWSING, label: "Explore for now", icon: Users },
];

const offerOptions = [
  [OfferType.FOOD, "Food"],
  [OfferType.TRANSPORTATION, "Transportation"],
  [OfferType.CHILDCARE, "Childcare"],
  [OfferType.PETCARE, "Pet care"],
  [OfferType.MENTAL_HEALTH_SUPPORT, "Mental health"],
  [OfferType.FINANCIAL_SUPPORT, "Financial support"],
  [OfferType.EDUCATIONAL_SUPPORT, "Education"],
  [OfferType.LEGAL_SUPPORT, "Legal support"],
  [OfferType.TECHNICAL_SUPPORT, "Technical help"],
  [OfferType.OTHER, "Something else"],
] as const;

function StepTwo({
  intentDetails,
  onBack,
  onChange,
  onContinue,
}: StepTwoProps) {
  const toggleIntent = (value: IntentType) => {
    const intent = intentDetails.intent.includes(value)
      ? intentDetails.intent.filter((item) => item !== value)
      : [...intentDetails.intent, value];
    onChange({ ...intentDetails, intent });
  };

  const toggleOffer = (value: OfferType) => {
    const offer = intentDetails.offer.includes(value)
      ? intentDetails.offer.filter((item) => item !== value)
      : [...intentDetails.offer, value];
    onChange({ ...intentDetails, offer });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue(intentDetails);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-4xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-2xl sm:p-8 lg:p-9"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <BriefcaseBusiness size={24} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Your community role
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl">
            How would you like to take part?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-on-surface-variant">
            Choose everything that feels right. You can change these preferences
            later.
          </p>
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-bold text-on-surface">
          I am here to...
        </legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {intentOptions.map(({ value, label, icon: Icon }) => {
            const selected = intentDetails.intent.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleIntent(value)}
                aria-pressed={selected}
                className={`flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary-fixed/60 text-primary"
                    : "border-surface-container-high bg-surface hover:border-primary/50"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-sm font-bold">{label}</span>
                {selected && <Check size={17} />}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="mb-3 text-sm font-bold text-on-surface">
          What kind of support interests you?
        </legend>
        <div className="flex flex-wrap gap-2">
          {offerOptions.map(([value, label]) => {
            const selected = intentDetails.offer.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleOffer(value)}
                aria-pressed={selected}
                className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-primary bg-primary text-on-primary"
                    : "border-surface-container-high bg-surface text-on-surface-variant hover:border-primary/50 hover:text-primary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

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
          disabled={intentDetails.intent.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

export default StepTwo;
