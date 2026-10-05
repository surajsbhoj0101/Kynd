import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';
import { ArrowRight, LayoutGrid } from 'lucide-react';

export default function ParticipationGrid() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Ways to Participate */}
      <section className="w-full py-space-2xl bg-surface-container-low/70">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Ways to Participate</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Three Ways You Can Transform Your Neighborhood
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Whether you have an hour to spare or need an extra set of hands, participation is frictionless and equal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {/* Option 1 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-56 w-full overflow-hidden">
                <img 
                  alt="Mother and child receiving supportive everyday community care" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  src="/images/6abb389d3804fbd99866b3ed_5.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1Wpw69jfQocFBYKtgYDcaf_YI6g08YsyNz0p-YMcHR74PYp3ooUxyu-GWYRVtZ_RHVmEHWGwnNRD-xtcF0rumWYWmJ3BgogK2h9lTe7u9yOr24-uVvQ8Hdk2izAu6BASfNUEyEWHN4GcvxUbIPfQNckViTmf2WubbRENw1jm7UyK5w8Zz6wD2oMsjhc2hlFXuxmdcJ_g1WqE1X3HXFKdUNr0_UoOIIcano_d84PmdRbb3OZHxYC5S9L6CWD")}
                />
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">01 • Direct Support</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Need Help</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Post genuine everyday requests from grocery pickups to tech setup within minutes.</p>
                </div>
                <Link to="/need-help" className="font-label-md text-label-md text-primary font-semibold hover:text-primary-container inline-flex items-center gap-1 pt-space-xs">
                  <span>Request Assistance</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Option 2 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-56 w-full overflow-hidden">
                <img 
                  alt="Energetic volunteers smiling and wearing green neighborhood aid gear" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  src="/images/6abb389d3804fbd99866b3f3_1.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1VJ2khgw2PsOE4bfgxgex9i2UmLx_wBbr0D_euexfBqTYNLTZLiVFzDzrfCqIDd7YalYFvy3CnGYBx4hsUbtksqb5WhJdBVw_Rjv_wLX828SPpVsE0RstnrH_inR-R3nO5pnQXsDo87uxirJRqNSekYQ20UTyBdVGm5MqprdSlUruTI0ylkC9OR0GIGJ373v_EOrGZ_1leRW6lGn5dyQJC_qve9gVLIyClksgVObPp70gh2G9RVj0nyb988")}
                />
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">02 • Local Availability</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Offer Help</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Share when you are free and what you can give within your chosen walking radius.</p>
                </div>
                <Link to="/offer-help" className="font-label-md text-label-md text-primary font-semibold hover:text-primary-container inline-flex items-center gap-1 pt-space-xs">
                  <span>Set Your Availability</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Option 3 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-56 w-full overflow-hidden">
                <img 
                  alt="Group of diverse community volunteers engaged in a local civic food program" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  src="/images/6abb389d3804fbd99866b3f3_2.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1UOwQOUw_WkeCrVgwFRpkVsfAAN_PPs48DaJuWeYRYVrakf8BP4QfrR5_8ZPg7bnyFj0OBXPz6iFErGZozexFJJHZxksNJD9_-8Uwq4ZENGQhZxfWH5usWqqJ7Wji7wZleDJh3zjuxiZTYmC33BrNyHORg1LqC1U-IKI_pKdpw0WRDHcwxHDwZBU2zigUjJ8o0jXEFQOPAeLMwOikEPe5DyTojWvDUA7Q96zDfgPIEUe2qno5OP2Xkmnr4h")}
                />
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm text-primary-container font-bold uppercase tracking-wider">03 • Collective Impact</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Community Teams</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Join group initiatives like pantries, environmental repairs, and neighborhood drives.</p>
                </div>
                <Link to="/community" className="font-label-md text-label-md text-primary font-semibold hover:text-primary-container inline-flex items-center gap-1 pt-space-xs">
                  <span>Browse Open Teams</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Everyday Help Categories Grid */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Everyday Mutual Help</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Support for Any Genuine Community Need
              </h2>
            </div>
            <Link to="/need-help" className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm w-fit inline-flex items-center gap-space-xs">
              <span>See All Active Causes</span>
              <LayoutGrid size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Category Card 1 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 w-full overflow-hidden">
                <img 
                  alt="Hands holding laptop and mobile device during digital skills mentorship" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_3.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1WOTrD5zGzk5YHMfMyoPoKWZ8d2z7JySCk4ErK6h2M-s8jMdF3cjviW4AwK-6mpqqQqz7uAvrfY9BHwiu1xDFN_Ft0NOBRZ8m1KsrSPmyjv3FwiLnExce0_FWRv3nOgqPqgIH2i7hlIW-caSz8b1egZcsPAxEMxV8lqFT8oVWTM7lF2HfIkR0PkCd6EQ5fqjLZOp8cb1Hs9vBdD1QguuBm2StMGocFpmdyOqSPeX95MFoRk40mx3qboIhcL")}
                />
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="font-title-md text-title-md text-on-surface">Tech &amp; Digital Literacy</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Helping seniors with smartphones, computer setup, resume editing, and digital basics.</p>
                </div>
                <div className="pt-space-xs flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>142 Active Needs</span>
                    <span className="text-primary font-bold">Avg 18m match</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <Link to="/need-help" className="mt-2 w-full py-2 rounded-xl bg-surface-container-low text-primary font-label-sm text-label-sm text-center hover:bg-surface-container transition-colors">
                    View Tech Requests
                  </Link>
                </div>
              </div>
            </div>

            {/* Category Card 2 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 w-full overflow-hidden">
                <img 
                  alt="Children and tutor reading storybooks together outdoors" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_4.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1VlY_NXP2GCqYZDrbI6ed6bC-H2OzVHzHkzpVLlIzKiXu7zZr-HZtrL_odL9ItpzfOWc1ASuEcBuvYfjRo1LCYmwiFJCFNDorGVqMDiV6w-TwD7roxmuutJLzIxOpQOvGOcq5eWMzcfcaJl2_583LRVRJlHoqB99SsdoaJXzlJjUj7MYkX-sqKsg1mGwyfAIvhBR0mlg446MnA7TUXRwSmeMcG_QJ8qVDGKtC_Q-DQHvNs2ds2BD193Rn8f")}
                />
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="font-title-md text-title-md text-on-surface">Study, Tutoring &amp; Reading</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">After-school reading assistance, language practice, and youth mentoring.</p>
                </div>
                <div className="pt-space-xs flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>98 Mentors Active</span>
                    <span className="text-secondary font-bold">1.2 km radius</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '64%' }}></div>
                  </div>
                  <Link to="/need-help" className="mt-2 w-full py-2 rounded-xl bg-surface-container-low text-primary font-label-sm text-label-sm text-center hover:bg-surface-container transition-colors">
                    View Tutoring
                  </Link>
                </div>
              </div>
            </div>

            {/* Category Card 3 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 w-full overflow-hidden">
                <img 
                  alt="Young neighbors working on community garden planting" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_5.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1UAJfysOk4vhjEEnzfyyKmSlas6atfGtjBZG26kKuZSD_s8Xh9I6GOuytEFaNDw31YuxM1fpa185YfYx4U47PNTnlSE27Er2OpKFTc9PhBSukCABDxwoPH9wLE40ipdWXyVuomvClz6K74lBIT_qXFng2XQZmDi_Rj-q_izuPzjp0ccsnkc23TL1BdzLAAtgpWr7iuuX3dRitre_OiF0XAaWT9O6-PshUQJx9iycX9ggDMDVrKejYJj66e2")}
                />
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="font-title-md text-title-md text-on-surface">Environmental Care</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Park cleanups, tree planting, composting support, and local gardening.</p>
                </div>
                <div className="pt-space-xs flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>12 Local Teams</span>
                    <span className="text-primary-container font-bold">240+ Joined</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <Link to="/community" className="mt-2 w-full py-2 rounded-xl bg-surface-container-low text-primary font-label-sm text-label-sm text-center hover:bg-surface-container transition-colors">
                    Join Team
                  </Link>
                </div>
              </div>
            </div>

            {/* Category Card 4 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-44 w-full overflow-hidden">
                <img 
                  alt="Neighbors helping elderly neighbor carry groceries" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_6.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1XQJNdtW6fRxlRhmvGAkRL-yl14yISLEZeeDOBKwTpY7mUA61vIRETa9VKhVbYmrLgfEwsfKGMgnarA-lG3Ksbu3qsOLVt81pNevfHN9aPf3bfjAMHCHHRwm1XIR1zb5rCU7GO1tjS3SKBlUo9MHmGWw_P7xLJWA2tWPbolgcrjoT-hvObpt3UNle6DXSCz1Bg9xiDUGe_KFZgBf94i80c9Gb6bCBcSO7Rs7LWPbAX8145RaQFUALeAf4nH")}
                />
              </div>
              <div className="p-space-md flex flex-col gap-space-sm flex-1 justify-between">
                <div className="flex flex-col gap-1">
                  <h4 className="font-title-md text-title-md text-on-surface">Household &amp; Mobility</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Grocery delivery for isolated residents, ride coordination, and quick household fixes.</p>
                </div>
                <div className="pt-space-xs flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                    <span>315 Completed</span>
                    <span className="text-primary font-bold">100% verified</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <Link to="/need-help" className="mt-2 w-full py-2 rounded-xl bg-surface-container-low text-primary font-label-sm text-label-sm text-center hover:bg-surface-container transition-colors">
                    View Errands
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
