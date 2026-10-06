import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';
import { ArrowRight, RefreshCcw, Navigation, ShieldCheck, PenLine, Compass, CheckCheck, ShieldCheck as ShieldCheckAlt, Sparkles, Gamepad2, ShoppingBag, Utensils, Briefcase, PawPrint, Leaf, PartyPopper } from 'lucide-react';

export default function AboutMutualAid() {
  const communityInterests = [
    { icon: PartyPopper, label: 'Events', color: 'text-primary' },
    { icon: Gamepad2, label: 'Gaming', color: 'text-secondary' },
    { icon: ShoppingBag, label: 'Buy & Sell', color: 'text-primary-container' },
    { icon: Utensils, label: 'Food', color: 'text-tertiary-container' },
    { icon: Briefcase, label: 'Careers', color: 'text-primary' },
    { icon: PawPrint, label: 'Pets', color: 'text-secondary' },
    { icon: Leaf, label: 'Environment', color: 'text-primary-container' },
    { icon: Sparkles, label: 'Hobbies', color: 'text-tertiary-container' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Community Interests Section — what makes Kynd a broader community platform */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            
            {/* Left: Clean Single Showcase Image */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-surface-container aspect-[4/3] w-full border border-surface-container-high/40">
                <img 
                  alt="Diverse neighbors connecting at a local community event in a vibrant neighborhood" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3ed_3.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuDewtf6W-HIcCgqi-o2FyyfbCtBmfHBq5jhsjWZEZD6D4U_4M78MDWtX_fIzveo1F0eBgtqaIhsmaAeVXxQR9yWgB4OzUMY5TSLDIFEMqaqXLqeXMhL-rsPXNisB4PJGCxXJ8kwUz8fGzspZrMGBZ945SqG2Iz8VxQZBlOAmoJDZd8V8MA2IGxlEZiKIy1LoQY_zq4VtRmeqXmk4AIZiU9Pcjp_EjtlEpXRD3nqecAeCzpEDJn5AXESdQ")}
                />
              </div>
            </div>

            {/* Right: Community Platform Copy & Interest Tiles */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Your Local Community Hub</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Everything Local, <br />All in One Place
                </h2>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                From neighborhood events and local buy &amp; sell to gaming groups, pet meetups, career networking, and community volunteering — Kynd brings your entire local world together. Set your radius and discover what's happening around you.
              </p>

              {/* Interest Tiles Grid */}
              <div className="grid grid-cols-4 gap-space-xs pt-space-xs">
                {communityInterests.map((interest) => (
                  <div key={interest.label} className="flex flex-col items-center gap-1.5 p-space-sm rounded-2xl bg-surface-container-low border border-surface-container/60 hover:shadow-md transition-all cursor-pointer">
                    <interest.icon size={22} className={`${interest.color} shrink-0`} />
                    <span className="font-label-sm text-label-sm text-on-surface text-center">{interest.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-space-xs">
                <Link to="/get-started" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm">
                  <span>Explore Your Community</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Mutual Help as Core Differentiator — what makes Kynd DIFFERENT from other community apps */}
      <section className="w-full py-space-2xl bg-surface-container-low/60 border-t border-b border-surface-container/50">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">What Makes Kynd Different</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Mutual Help at the Heart of Community
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Other apps connect you to strangers. Kynd connects you to neighbors who help each other — with dignity, no ratings, and zero fees.
              </p>
            </div>
            <Link to="/philosophy" className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm w-fit inline-flex items-center gap-space-xs">
              <span>Our Philosophy</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">01</span>
                <RefreshCcw size={24} className="text-secondary" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Two-Way Support</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Ask for help today, give help tomorrow. Everyone participates as equals.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">02</span>
                <Navigation size={22} className="text-primary" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Walking Distance</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Set your personal radius — help stays hyperlocal within your neighborhood.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">03</span>
                <ShieldCheck size={24} className="text-secondary" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Zero Ratings</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">No stars, no leaderboards. Just dignified contribution records that honor everyone.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-primary-fixed-dim text-primary font-label-sm text-label-sm font-bold">04</span>
                <ShieldCheckAlt size={24} className="text-primary-container" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Verified & Free</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Every member verified, no gig fees, no commissions. Community infrastructure, not a marketplace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
