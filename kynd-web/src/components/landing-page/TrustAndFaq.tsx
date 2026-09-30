import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
}

export default function TrustAndFaq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqItems: FaqItem[] = [
    {
      question: "Is Kynd free to use?",
      answer: "Yes, Kynd is 100% free community infrastructure. There are no service fees, no transactional commissions, and no paywalls. We are supported by civic grants, verified municipal partners, and community donations."
    },
    {
      question: "How does Kynd ensure personal safety?",
      answer: "Safety is structural: every account undergoes mandatory phone verification, private addresses are never displayed publicly, both members must accept the match before chat opens, and built-in check-in alerts let trusted contacts track active sessions."
    },
    {
      question: "Why are there no star ratings or leaderboards?",
      answer: "Mutual aid is built on human dignity and shared community, not transactional reviews. Star ratings penalize vulnerable people and turn kindness into a popularity contest. Instead, Kynd displays simple, verified contribution histories."
    },
    {
      question: "Can organizations and nonprofits use Kynd?",
      answer: "Yes! 501(c)(3) charities, schools, community gardens, and registered local initiatives can register an Organization profile to organize weekend teams, assemble volunteers, and broadcast urgent neighborhood drives."
    },
    {
      question: "How do radius preferences work?",
      answer: "You have complete control: you can set your direct personal help radius to a tight 1 to 3 kilometers (walking distance), while expanding your group activity or emergency aid radius up to 10-15 kilometers."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Safety & Trust */}
      <section className="w-full py-space-2xl bg-surface-container-low/70">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs text-center items-center max-w-2xl mx-auto">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Safety First</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Built Ground-Up for Neighborhood Safety
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We combine real-identity verification with active safety tools so neighbors feel completely comfortable reaching out or meeting up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface">Mandatory Verification</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Every neighbor is confirmed via SMS and local identity verification.</p>
            </div>

            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">handshake</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface">Mutual Acceptance</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Connections happen only when both people explicitly agree to connect.</p>
            </div>

            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[24px]">share_location</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface">Safety Check-Ins</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Automated alerts keep trusted contacts informed during in-person sessions.</p>
            </div>

            <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
              <div className="w-12 h-12 rounded-xl bg-error-container flex items-center justify-center text-on-error-container">
                <span className="material-symbols-outlined text-[24px]">emergency</span>
              </div>
              <h4 className="font-title-md text-title-md text-on-surface">Civic Moderation</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Active neighborhood moderators provide rapid assistance 24/7.</p>
            </div>
          </div>

          <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">gavel</span>
              <span className="font-body-sm text-body-sm text-on-surface">
                Read our <strong>Mutual Trust Standard</strong> to learn how personal addresses are never exposed until both parties agree.
              </span>
            </div>
            <Link to="/safety" className="font-label-md text-label-md text-primary font-bold hover:underline shrink-0">
              Learn More About Trust →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FAQ Accordion */}
      <section className="w-full py-space-2xl bg-surface border-t border-surface-container/50">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <div className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Frequently Asked</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Got Questions? <br />
                  <span className="text-primary">We Have Answers.</span>
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Everything you need to know about our mutual help protocol, verified privacy, and zero-fee structure.
                </p>
              </div>
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
                <span className="font-title-md text-title-md text-on-surface">Still have a question?</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Our neighborhood guides and moderators are active around the clock.
                </p>
                <Link to="/safety" className="px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md text-center hover:bg-primary-container transition-colors shadow-sm">
                  Contact Civic Support
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              {faqItems.map((faq, index) => (
                <div key={index} className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full p-space-lg flex items-center justify-between text-left gap-space-md" 
                    type="button"
                  >
                    <span className="font-title-md text-title-md text-on-surface">{faq.question}</span>
                    <span className={`material-symbols-outlined text-primary text-[24px] transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-space-lg pb-space-lg text-on-surface-variant font-body-sm text-body-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
