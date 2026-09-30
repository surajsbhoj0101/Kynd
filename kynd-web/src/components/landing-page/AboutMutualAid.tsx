import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';

export default function AboutMutualAid() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Philosophy Section */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            
            {/* Left: Clean Single Showcase Image */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-lg bg-surface-container aspect-[4/3] w-full border border-surface-container-high/40">
                <img 
                  alt="Young Indian volunteer woman sharing fresh vegetables and grocery bag with elderly neighbor" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3ed_3.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuDewtf6W-HIcCgqi-o2FyyfbCtBmfHBq5jhsjWZEZD6D4U_4M78MDWtX_fIzveo1F0eBgtqaIhsmaAeVXxQR9yWgB4OzUMY5TSLDIFEMqaqXLqeXMhL-rsPXNisB4PJGCxXJ8kwUz8fGzspZrMGBZ945SqG2Iz8VxQZBlOAmoJDZd8V8MA2IGxlEZiKIy1LoQY_zq4VtRmeqXmk4AIZiU9Pcjp_EjtlEpXRD3nqecAeCzpEDJn5AXESdQ")}
                />
              </div>
            </div>

            {/* Right: Clean Philosophy Copy & Pillars */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Our Philosophy</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Rooted in Dignity &amp; Reciprocity
                </h2>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Kynd connects neighbors directly without transactional gig fees, star ratings, or charity hierarchies. Support is shared, equal, and rooted right on your block.
              </p>

              {/* 3 Spaced Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
                <div className="flex items-start gap-space-xs p-space-sm rounded-2xl bg-surface-container-low border border-surface-container/60">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">sync_alt</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-title-sm text-title-sm font-bold text-on-surface">Two-Way Support</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Shared &amp; equal</span>
                  </div>
                </div>

                <div className="flex items-start gap-space-xs p-space-sm rounded-2xl bg-surface-container-low border border-surface-container/60">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">near_me</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-title-sm text-title-sm font-bold text-on-surface">Hyperlocal Proximity</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Walking radius</span>
                  </div>
                </div>

                <div className="flex items-start gap-space-xs p-space-sm rounded-2xl bg-surface-container-low border border-surface-container/60">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">shield_with_heart</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-title-sm text-title-sm font-bold text-on-surface">Zero Ratings</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Dignity first</span>
                  </div>
                </div>
              </div>

              <div className="pt-space-xs">
                <Link to="/philosophy" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm">
                  <span>Read Our Full Charter</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Transparent Matching Loop */}
      <section className="w-full py-space-2xl bg-surface-container-low/60 border-t border-b border-surface-container/50">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Transparent Process</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                How the Kynd Matching Loop Works
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                A safe, two-sided protocol designed for mutual dignity, comfort, and verified safety.
              </p>
            </div>
            <Link to="/philosophy" className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm w-fit inline-flex items-center gap-space-xs">
              <span>Explore Protocol</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">Step 01</span>
                <span className="material-symbols-outlined text-secondary text-[24px]">edit_note</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Post Need</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Select a category, describe what's needed, and set your local radius.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold">Step 02</span>
                <span className="material-symbols-outlined text-primary text-[24px]">explore</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Smart Match</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Matched securely by walking proximity, skills, and open hours.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Step 03</span>
                <span className="material-symbols-outlined text-secondary text-[24px]">mark_chat_read</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Double Acceptance</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Both parties review and confirm before private messaging opens.</p>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md border border-surface-container/50">
              <div className="flex items-center justify-between">
                <span className="px-space-sm py-1 rounded-full bg-primary-fixed-dim text-primary font-label-sm text-label-sm font-bold">Step 04</span>
                <span className="material-symbols-outlined text-primary-container text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Verified Record</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Help is logged with zero ratings—honoring dignity and contribution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
