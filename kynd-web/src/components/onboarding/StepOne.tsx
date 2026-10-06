import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  Flower2,
  UserPen,
  User,
} from "lucide-react";
import { ProfileDetails } from "../../types/onboarding-types.ts";

type StepOneProps = {
  profileDetails: ProfileDetails;
  onContinue: (details: ProfileDetails) => void;
  setProfileDetails: (details: ProfileDetails) => void;
};

function StepOne({
  profileDetails,
  onContinue,
  setProfileDetails,
}: StepOneProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!profileDetails.profileImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(profileDetails.profileImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [profileDetails.profileImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileDetails({ ...profileDetails, profileImage: file });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue({
      name: profileDetails.name.trim(),
      bio: profileDetails.bio.trim(),
      profileImage: profileDetails.profileImage,
      interests: profileDetails.interests,
      skills: profileDetails.skills,
    });
  };

  return (
    <div className="grid w-full max-w-6xl overflow-hidden rounded-4xl border border-surface-container-high bg-surface-container-lowest shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-primary p-8 text-on-primary lg:flex lg:flex-col lg:justify-between">
        <img
          src="/images/6abb389d3804fbd99866b3ed_1.png"
          alt="Neighbors supporting one another"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/90 to-primary/60" />
        <Link to="/" className="relative z-10 flex w-fit items-center gap-2">
          <Flower2 size={30} className="text-primary-fixed" />
          <span className="text-2xl font-extrabold tracking-tight">kynd</span>
        </Link>
        <div className="relative z-10 max-w-sm">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary shadow-lg">
            <UserPen size={28} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">
            Please tell us a bit about yourself
          </p>
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Tell us a little about yourself so we can make Kynd feel more
            personal from the start.
          </h2>
        </div>
        <p className="relative z-10 text-xs text-surface-container-low/70">
          Civic trust, built locally.
        </p>
      </aside>

      <section className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary lg:hidden"
          >
            <Flower2 size={28} />
            <span className="text-2xl font-extrabold tracking-tight">kynd</span>
          </Link>
        </div>

        <div className=" max-w-lg">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Your profile
          </p>

          <p className="mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
            Add a few details to make your first conversations feel more
            personal.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              <label className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-primary-fixed/40 text-primary transition-colors hover:border-primary hover:bg-primary-fixed">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={30} strokeWidth={1.6} />
                )}
                <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
                  <Camera size={13} />
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  Profile photo
                </p>
                <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                  Optional. A clear photo helps neighbours recognise you.
                </p>
              </div>
            </div>

            <label className="flex flex-col gap-2 text-xs font-bold text-on-surface">
              What should we call you?
              <span className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={profileDetails.name}
                  onChange={(event) =>
                    setProfileDetails({
                      ...profileDetails,
                      name: event.target.value,
                    })
                  }
                  placeholder="Your name"
                  className="w-full rounded-xl border border-surface-container-high bg-surface px-10 py-3 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
                />
              </span>
            </label>

            <label className="flex flex-col gap-2 text-xs font-bold text-on-surface">
              About you{" "}
              <span className="font-normal text-on-surface-variant">
                (optional)
              </span>
              <textarea
                value={profileDetails.bio}
                onChange={(event) =>
                  setProfileDetails({
                    ...profileDetails,
                    bio: event.target.value,
                  })
                }
                maxLength={240}
                rows={2}
                placeholder="Tell your community a little about yourself, your interests, or what brings you here."
                className="resize-none rounded-xl border border-surface-container-high bg-surface px-4 py-2.5 text-sm leading-6 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
              />
              <span className="text-right text-[11px] font-normal text-on-surface-variant">
                {profileDetails.bio.length}/240
              </span>
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-md transition-colors hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Continue
              <ArrowRight size={16} />
            </button>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-on-surface-variant">
              <Check size={14} className="text-primary" />
              You can update these details later.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default StepOne;
