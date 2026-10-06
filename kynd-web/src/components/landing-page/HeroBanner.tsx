import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';
import { ArrowRight, HeartHandshake, Users, MapPin, BadgeCheck, Sparkles, Calendar } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="flex flex-col w-full">
      {/* Main Hero Section with Background Image */}
      <section className="relative w-full overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center bg-primary">
        {/* Background image backdrop */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/images/6abb389d3804fbd99866b3ed_1.png" 
            onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuAMdOdMAYP3Z_CjPx4_1cqkmmsbAF56yXzXBfz45biMPISz7IT41JSXmHog1opO_Lk1uhydCQl3xg3stFoWkzKROp1lr6z9VVDw2Zp0mPIclqDPolRsdHV6di2l653F8mnH45hZYeCgGVWX6oEiOPXNqgfJX7d4IScE0UeXNIJXDwL3vNmnNdw_IpHzKPo6RkQBPJhwimtuCiYsvdmGlt_Fg61frR4tl4tGNknYdLkTaN8y_mHo5CmmRQ")}
            alt="Vibrant local community gathering in a neighborhood" 
            className="w-full h-full object-cover"
          />
          {/* Rich dark gradient overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-2xl flex flex-col justify-center">
          <div className="max-w-2xl flex flex-col gap-space-md text-on-primary">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface/15 backdrop-blur-md border border-surface/20 text-on-primary w-fit shadow-sm">
           
              <span className="font-label-sm text-label-sm tracking-wide font-bold text-primary-fixed">Your Neighborhood, Connected • Powered by Mutual Help</span>
            </div>

            {/* Headline & Subtitle */}
            <div className="flex flex-col gap-space-sm">
              <h1 className="font-display text-headline-lg md:text-display text-on-primary tracking-tight leading-tight">
                Your Local Community, <br />
                <span className="text-primary-fixed">Built on Kindness</span>
              </h1>
              <p className="font-body-lg text-body-lg text-surface-container-low/90 leading-relaxed max-w-xl">
                Kynd is your hyperlocal community platform — discover events, connect with neighbors, share interests, and help each other out. All within walking distance.
              </p>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link to="/get-started" className="px-space-xl py-space-md rounded-xl bg-surface text-primary font-bold font-label-md text-label-md hover:bg-surface-container transition-all shadow-lg flex items-center justify-center gap-space-xs">
                <span>Join Your Neighborhood</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/offer-help" className="px-space-xl py-space-md rounded-xl bg-transparent border-2 border-surface/40 hover:border-surface text-on-primary font-bold font-label-md text-label-md hover:bg-surface/10 transition-all flex items-center justify-center gap-space-xs shadow-sm backdrop-blur-sm">
                <span>Offer Help</span>
                <HeartHandshake size={18} />
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-space-sm pt-space-md border-t border-surface/15 max-w-lg mt-space-xs">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">4,280+</span>
                <span className="font-body-sm text-body-sm text-surface-container-low/80">Neighbors Joined</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">120+</span>
                <span className="font-body-sm text-body-sm text-surface-container-low/80">Active Communities</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">1,850+</span>
                <span className="font-body-sm text-body-sm text-surface-container-low/80">Mutual Help Sessions</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ticker Strip */}
      <div className="w-full bg-primary-container py-space-sm text-on-primary overflow-hidden select-none">
        <div className="max-w-[1280px] mx-auto px-margin flex items-center justify-around text-center gap-space-md text-sm uppercase tracking-widest font-label-md">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>Hyperlocal Communities</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Events & Interests</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Mutual Help</span>
          </div>
          <div className="flex items-center gap-2">
            <BadgeCheck size={16} />
            <span>Verified & Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
