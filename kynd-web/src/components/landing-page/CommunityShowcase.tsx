import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';
import { UsersRound, MapPin } from 'lucide-react';

export default function CommunityShowcase() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Weekend Teams & Initiatives */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Live In Your Area</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Teams Forming This Weekend
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Join verified neighborhood collectives working together on immediate civic needs.
              </p>
            </div>
            <Link to="/community" className="px-space-lg py-space-sm rounded-xl bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors w-fit inline-flex items-center gap-space-xs">
              <span>View All 18 Open Teams</span>
              <UsersRound size={16} />
            </Link>
          </div>

          {/* Team Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Team Card 1 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  alt="Neighbors sharing fresh seasonal vegetables and groceries" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3ed_2.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuDewtf6W-HIcCgqi-o2FyyfbCtBmfHBq5jhsjWZEZD6D4U_4M78MDWtX_fIzveo1F0eBgtqaIhsmaAeVXxQR9yWgB4OzUMY5TSLDIFEMqaqXLqeXMhL-rsPXNisB4PJGCxXJ8kwUz8fGzspZrMGBZ945SqG2Iz8VxQZBlOAmoJDZd8V8MA2IGxlEZiKIy1LoQY_zq4VtRmeqXmk4AIZiU9Pcjp_EjtlEpXRD3nqecAeCzpEDJn5AXESdQ")}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <MapPin size={14} />
                  <span>1.2 km away • Indiranagar</span>
                </div>
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm text-tertiary-container font-bold">Seva-Fresh Collective</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Weekend Senior Grocery Sharing</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Assembling fresh organic farm produce bags for elderly neighbors living independently.</p>
                </div>
                <div className="flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span>Sat 8:30 AM</span>
                    <span className="text-tertiary-container font-bold">8 / 10 Joined</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary-container h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <Link to="/community" className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md text-center hover:bg-primary-container transition-colors shadow-sm">
                    Join This Team
                  </Link>
                </div>
              </div>
            </div>

            {/* Team Card 2 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  alt="Community learning and notebook distribution team" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_7.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida-public/AB6AXuCdWbTvjv5H1fBioTv8qVQW0vGAzgkIgOJFNqCUsLlUGYGp-PDTqG-sb-VotkzR2HHkJTH-GNZoXZ7lIt-pIMaFMU9DIQW4wUBLtSNx38s5Wgxt-bKRT0mpNu7Hca8rhd3I8y5CuttxerVQblSAQDMaOtEYaNRqayPPxaUMZ57o0CZFNHVdFLxGbihF6kstLr4TRoTnXUC_dTQqLQkW8a3OTnzTeZU7oLiKCTfvQN7vrIaXfy-wZQxHhQ")}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <MapPin size={14} />
                  <span>2.4 km away • Domlur</span>
                </div>
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm text-primary-container font-bold">Vidya Pragati Initiative</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Community Study Kit Distribution</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Distributing school notebooks, stationery kits, and conducting weekend reading circles.</p>
                </div>
                <div className="flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span>Sun 10:00 AM</span>
                    <span className="text-primary-container font-bold">14 / 15 Joined</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: '93%' }}></div>
                  </div>
                  <Link to="/community" className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md text-center hover:bg-primary-container transition-colors shadow-sm">
                    Join This Team
                  </Link>
                </div>
              </div>
            </div>

            {/* Team Card 3 */}
            <div className="flex flex-col bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  alt="Enthusiastic neighbors holding signs and clean-up bags" 
                  className="w-full h-full object-cover" 
                  src="/images/6abb389d3804fbd99866b3f3_8.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1WMplTAjzhJtaVv2cx0Nbm2nCZmHFnslV8NQXFvSv-tLs8MnI04D0ESJ1aXwVZKjbIUvTsZLDanPPW5IZkaAAGkkIsvIkKi-fds3vvL4mqmCo37DpWmYo6Jt6V1ld9mZP8TI3ri6XICrdy5GdVmeoX52w2te-Tj1Ab0xRsL0MA_shpmd0UeQ37nMKy1gKsq-thn2phsTHdNuh33rgJJS_ljyapHXYxyfBrnZfnUdHNadUKHttH-NFVjUbDb")}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-bold flex items-center gap-1">
                  <MapPin size={14} />
                  <span>4.0 km away</span>
                </div>
              </div>
              <div className="p-space-lg flex flex-col gap-space-md flex-1 justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm text-secondary font-bold">Harbor Neighborhood Team</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Park &amp; Shoreline Cleanup</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Removing plastics from shoreline trails and planting native ground-cover grasses.</p>
                </div>
                <div className="flex flex-col gap-2 pt-space-xs">
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span>Sat 9:00 AM</span>
                    <span className="text-secondary font-bold">24 / 30 Joined</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <Link to="/community" className="mt-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md text-center hover:bg-primary-container transition-colors shadow-sm">
                    Join This Team
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Action Photo Gallery Mosaic */}
          <div className="flex flex-col gap-space-sm pt-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-center font-bold">Neighborhood Action Moments</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter-sm">
              <div className="h-44 rounded-2xl overflow-hidden shadow-sm">
                <img 
                  alt="Volunteers smiling in green shirts distributing supplies" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  src="/images/6abb389d3804fbd99866b3f3_1.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1VBmtfBTXay4-maTndagjNpWlF18s3H7mzDvj4SFeF4eXXRXj9ZfYUB8_G1BaygC_lL-Ju_ccTXsclV_XfzXElvi-uu3wHQlg9tgIbXgdcVEwbYmjB11-yOf2qHQKuZ0m1vUT_U5slMQfXQaE42ezTRWWOtKBJKV7-nJUoWg3Vp_kqKRoqr4jfnbDNztKYTbTrdO3hDmnO1FLTsNWUF7tYmoq04aaovJnSnVsbuouNIzL4R3L9ryO9zkw_J")}
                />
              </div>
              <div className="h-44 rounded-2xl overflow-hidden shadow-sm">
                <img 
                  alt="Neighbors working together with planting tools" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  src="/images/6abb389d3804fbd99866b3f3_5.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1VwgiNUJsLdqnZXOVZa7VdcXKqQMUySCpM6PLiRThztd_C3z371nu4Fg20dUPpCIjvFsWhEltXsmd2qh07nikl9vrXM2rdp_W8iOypAaj9vkYiAKhjWa61gS7GUJTctAQofEMupd_7K1scZjxfyZC864actdA9mXALdyvdAD-KagXlQcCJ9Wo9goI6qyhi2eoGTX2n61tTD3AUmI9FNRHTpP4dKbJ95kfwMFHT1m9wB3Sltqo1YBVMYPCt2")}
                />
              </div>
              <div className="h-44 rounded-2xl overflow-hidden shadow-sm">
                <img 
                  alt="Team packing pantry care packages" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  src="/images/6abb389d3804fbd99866b3f3_9.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1U1vMM-XLrGKYPnauwyZn7Vml80wQ9wi0mKL4sOBQGaDiBx9oUwPy46LLQgH5xBKOjUk4XjIpj8ofq9jYdlcbQjx3BjwKRV333vteW-amv211AqETo7YVq6yvPMp6MdNL5zGbMflZxhd37463AIRewa5OGM3zgjHZSzpC7hRpZhF-THUO1c6Sqma0beARNPEtM1gV23lCtGOdWRHtIb6XoNmuHQ6k3u0EXzl2G7g7DI1T0oiBAwcplFky3v")}
                />
              </div>
              <div className="h-44 rounded-2xl overflow-hidden shadow-sm">
                <img 
                  alt="Neighbors laughing together after finishing park repair project" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                  src="/images/6abb389d3804fbd99866b3f3_2.png" 
                  onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1WQNKdMGar3AqgBgaQK9HpIRB986cFGZHjpBZrQ5oQRU2Lzpf5ZOiCH827DO_-WXjFEHAdpJOsDdKy28QbzJU-d6-DeilOUU9xn_iZCVosj7SJSBVZo-Nb9flfAzkIhX9a8T407tS2A5TTpaRyCAJ-BWVR84W0Kq6HdYGzOiGUzNMHVfE3mXW-M1YSuecQlvlDM7DXXKyVSyOiV6LcbNSN9oiJTJleLyLVR9tSNy0UkSeVlC4gi9qUg3YVA")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials */}
      <section className="w-full py-space-2xl bg-surface-container-low/50 border-t border-surface-container/50">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs text-center items-center max-w-2xl mx-auto">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Contribution, Not Competition</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Stories of True Mutual Help
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Because anyone can need help today and offer help tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                "Last month I broke my wrist and neighbors helped with school drop-offs. This month I helped two high schoolers prep for chemistry. That's Kynd."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">ER</div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">Elena Rostova</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Mom &amp; Science Tutor</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                "I love that there are no 1-to-5 star reviews. Just honest records of who showed up and how we helped each other. Pure dignity."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-secondary">MV</div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">Marcus Vance</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Senior Tech Mentor</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                "Coordinating food distribution used to take dozens of messy group chats. With Kynd teams, 15 volunteers assembled in under 2 hours."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center font-bold text-primary">PP</div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">Priya Patel</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Team Organizer</span>
                </div>
              </div>
            </div>

            <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant italic">
                "Setting a 2 km radius means I only help people I might run into at the local bakery. It makes our neighborhood feel alive again."
              </p>
              <div className="flex items-center gap-space-sm pt-space-xs">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">DC</div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">David Chen</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Everyday Helper</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
