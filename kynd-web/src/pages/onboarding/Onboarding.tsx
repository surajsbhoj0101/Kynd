import { useState, useEffect } from "react";
import StepOne from "../../components/onboarding/StepOne.tsx";
import StepThree from "../../components/onboarding/StepThree.tsx";
import StepTwo from "../../components/onboarding/StepTwo.tsx";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  AvailabilityDetails,
  DayOfWeek,
  IntentDetails,
  IntentType,
  OfferType,
  ProfileDetails,
} from "../../types/onboarding-types.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { apiFetch } from "../../lib/api-client.ts";
import { toast } from "sonner";

function Onboarding() {
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    name: "",
    bio: "",
    profileImage: null,
  });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Redirect to the sign-in page if the user is not authenticated
      navigate("/signin");
    }
    setProfileDetails((prevDetails) => ({
      ...prevDetails,
      name: user?.name || "",
    }));
  }, [user, loading]);

  const [intentDetails, setIntentDetails] = useState<IntentDetails>({
    intent: [IntentType.JUST_BROWSING],
    offer: [OfferType.OTHER],
  });

  const [availabilityDetails, setAvailabilityDetails] =
    useState<AvailabilityDetails>({
      availabilityDay: [DayOfWeek.MONDAY],
      availabilityTime: "",
      area: {
        label: "",
        longitude: null,
        latitude: null,
      },
      personalHelpRadius: 2,
      communityHelpRadius: 2,
    });

  const saveOnboarding = async (details: AvailabilityDetails) => {
    if (details.area.longitude === null || details.area.latitude === null) {
      toast.error("Use Locate to confirm your area before finishing setup.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        "profileDetails",
        JSON.stringify({
          name: profileDetails.name,
          bio: profileDetails.bio,
        }),
      );
      formData.append("intentDetails", JSON.stringify(intentDetails));
      formData.append("availabilityDetails", JSON.stringify(details));

      if (profileDetails.profileImage) {
        formData.append("profileImage", profileDetails.profileImage);
      }

      const response = await apiFetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/onboarding`,
        {
          method: "PUT",
          body: formData,
        },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Unable to save onboarding.");
      }

      await fetchUser();
      setAvailabilityDetails(details);
      setOnboardingStep(4);
      toast.success("Your onboarding details have been saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save onboarding.",
      );
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <StepOne
            profileDetails={profileDetails}
            setProfileDetails={setProfileDetails}
            onContinue={(details) => {
              setProfileDetails(details);
              setOnboardingStep(2);
            }}
          />
        );
      case 2:
        return (
          <StepTwo
            intentDetails={intentDetails}
            onBack={() => setOnboardingStep(1)}
            onChange={setIntentDetails}
            onContinue={(details) => {
              setIntentDetails(details);
              setOnboardingStep(3);
            }}
          />
        );
      case 3:
        return (
          <StepThree
            availabilityDetails={availabilityDetails}
            onBack={() => setOnboardingStep(2)}
            onChange={setAvailabilityDetails}
            onComplete={saveOnboarding}
            saving={saving}
          />
        );
      case 4:
        return (
          <div className="w-full max-w-2xl rounded-4xl border border-surface-container-high bg-surface-container-lowest p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-on-surface">
              You are all set
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
              Your preferences are ready. We can now help you find meaningful
              local connections.
            </p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mx-auto mt-7 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Start your journey
              <ArrowRight size={16} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-surface via-surface-container-low to-primary-fixed/30 px-3 py-3 sm:px-6 sm:py-4">
      {/* step indicator */}
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-surface-container-lowest px-3 py-1.5 text-xs font-bold text-on-surface-variant">
        <span>
          {onboardingStep === 4
            ? "Onboarding complete"
            : `Step ${onboardingStep} of 3`}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${
            onboardingStep === 1 ? "bg-primary" : "bg-on-surface-variant/30"
          }`}
        />
        <span
          className={`h-2 w-2 rounded-full ${
            onboardingStep === 2 ? "bg-primary" : "bg-on-surface-variant/30"
          }`}
        />
        <span
          className={`h-2 w-2 rounded-full ${
            onboardingStep === 3 ? "bg-primary" : "bg-on-surface-variant/30"
          }`}
        />
      </div>
      {renderStep()}
    </main>
  );
}

export default Onboarding;
