import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Wrench,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import {
  InterestType,
  ProfileDetails,
  SkillType,
} from "../../types/onboarding-types";

type StepTwoProps = {
  profileDetails: ProfileDetails;
  onBack: () => void;
  onChange: (details: Partial<ProfileDetails>) => void;
  onContinue: (details: Partial<ProfileDetails>) => void;
};

const interestOptions: [InterestType, string, string][] = [
  [InterestType.NEIGHBORHOOD, "Neighbourhood", "🏘️"],
  [InterestType.COMMUNITY, "Community", "🤝"],
  [InterestType.EDUCATION, "Education", "📚"],
  [InterestType.SPORTS, "Sports", "⚽"],
  [InterestType.FITNESS, "Fitness", "💪"],
  [InterestType.TECHNOLOGY, "Technology", "💻"],
  [InterestType.PETS, "Pets", "🐾"],
  [InterestType.ENVIRONMENT, "Environment", "🌱"],
  [InterestType.EVENTS, "Events", "🎉"],
  [InterestType.FOOD, "Food", "🍜"],
  [InterestType.HOBBIES, "Hobbies", "🎨"],
  [InterestType.GAMING, "Gaming", "🎮"],
  [InterestType.CAREER, "Career", "💼"],
  [InterestType.LOCAL_BUSINESS, "Local business", "🏪"],
  [InterestType.BUY_SELL, "Buy & sell", "🛒"],
  [InterestType.TRAVEL, "Travel", "✈️"],
  [InterestType.VOLUNTEERING, "Volunteering", "🙋"],
  [InterestType.SOCIAL, "Social", "☕"],
];

const skillOptions: [SkillType, string, string][] = [
  [SkillType.TECHNOLOGY, "Technology", "💻"],
  [SkillType.TEACHING, "Teaching", "📖"],
  [SkillType.TUTORING, "Tutoring", "✏️"],
  [SkillType.WRITING, "Writing", "✍️"],
  [SkillType.DESIGN, "Design", "🎨"],
  [SkillType.PHOTOGRAPHY, "Photography", "📷"],
  [SkillType.COOKING, "Cooking", "🍳"],
  [SkillType.REPAIR, "Repair", "🔧"],
  [SkillType.DIY, "DIY", "🛠️"],
  [SkillType.MOVING, "Moving", "📦"],
  [SkillType.TRANSPORT, "Transport", "🚗"],
  [SkillType.ERRANDS, "Errands", "🏃"],
  [SkillType.PET_CARE, "Pet care", "🐶"],
  [SkillType.GARDENING, "Gardening", "🌻"],
  [SkillType.FITNESS, "Fitness", "🏋️"],
  [SkillType.SPORTS, "Sports", "🏀"],
  [SkillType.EVENT_HELP, "Event help", "🎪"],
  [SkillType.ORGANIZING, "Organizing", "📋"],
  [SkillType.FIRST_AID, "First aid", "🩹"],
];

const INITIAL_VISIBLE_COUNT = 9;

function StepTwo({
  profileDetails,
  onBack,
  onChange,
  onContinue,
}: StepTwoProps) {
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const toggle = <T extends string>(
    key: "interests" | "skills",
    value: T,
  ) => {
    const current = profileDetails[key] as T[];
    onChange({
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue({
      interests: profileDetails.interests,
      skills: profileDetails.skills,
    });
  };

  const choices = (
    key: "interests" | "skills",
    options: [string, string, string][],
    showAll: boolean,
    setShowAll: (val: boolean) => void,
  ) => {
    const visibleOptions = showAll
      ? options
      : options.slice(0, INITIAL_VISIBLE_COUNT);
    const hiddenCount = options.length - INITIAL_VISIBLE_COUNT;
    const selectedValues = profileDetails[key] as string[];
    // Count how many hidden items are selected (to show in badge)
    const hiddenSelectedCount = showAll
      ? 0
      : options
          .slice(INITIAL_VISIBLE_COUNT)
          .filter(([value]) => selectedValues.includes(value)).length;

    return (
      <div className="flex flex-col gap-3">
        <div className="grid gap-2 sm:grid-cols-3">
          {visibleOptions.map(([value, label, emoji]) => {
            const selected = selectedValues.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggle(key, value)}
                aria-pressed={selected}
                className={`group rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all duration-200 ${
                  selected
                    ? "border-primary bg-primary-fixed/60 text-primary shadow-sm"
                    : "border-surface-container-high bg-surface text-on-surface-variant hover:border-primary/50 hover:bg-surface-container-low"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{emoji}</span>
                  {label}
                  {selected && (
                    <Check
                      size={14}
                      className="ml-auto text-primary"
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mx-auto flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-fixed/40"
          >
            {showAll ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show {hiddenCount} more
                {hiddenSelectedCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                    {hiddenSelectedCount}
                  </span>
                )}
                <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const interestCount = profileDetails.interests.length;
  const skillCount = profileDetails.skills.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-4xl border border-surface-container-high bg-surface-container-lowest p-5 shadow-2xl sm:p-8 lg:p-9"
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <Sparkles size={24} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Personalise your experience
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl">
            What brings you to Kynd?
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-5 text-on-surface-variant">
            Pick the interests and skills that describe you. We'll use
            these to connect you with the right people and communities
            nearby.
          </p>
        </div>
      </div>

      {/* Interests */}
      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-on-surface">
          <Heart size={16} className="text-primary" />
          Your interests
          {interestCount > 0 && (
            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-fixed px-1.5 text-[11px] font-bold text-primary">
              {interestCount} selected
            </span>
          )}
        </legend>
        {choices(
          "interests",
          interestOptions,
          showAllInterests,
          setShowAllInterests,
        )}
      </fieldset>

      {/* Divider */}
      <div className="my-6 border-t border-surface-container-high/60" />

      {/* Skills */}
      <fieldset>
        <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-on-surface">
          <Wrench size={16} className="text-primary" />
          Skills you can share
          {skillCount > 0 && (
            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-fixed px-1.5 text-[11px] font-bold text-primary">
              {skillCount} selected
            </span>
          )}
        </legend>
        {choices("skills", skillOptions, showAllSkills, setShowAllSkills)}
      </fieldset>

      {/* Actions */}
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
            profileDetails.interests.length === 0 ||
            profileDetails.skills.length === 0
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

export default StepTwo;
