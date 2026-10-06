import { Link } from 'react-router-dom';
import { handleImgError } from '../../utils/imageFallback';

export default function CtaBanner() {
  return (
    <section className="relative w-full py-space-2xl bg-surface-container-lowest overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-md lg:px-margin-lg relative">
        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-space-md py-space-xl">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">Join Your Local Community</span>
          <h2 className="font-display text-headline-lg md:text-display text-on-surface tracking-tight">
            Your Neighborhood Is Waiting. <br />
            <span className="text-primary">Be Part of It.</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Discover events, connect with neighbors, share your skills, or just explore what's happening around you. Kynd makes your neighborhood come alive.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-sm">
            <Link to="/get-started" className="px-space-xl py-space-md rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-md">
              Join Your Neighborhood
            </Link>
            <Link to="/community" className="px-space-xl py-space-md rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md hover:bg-secondary-fixed transition-all shadow-sm">
              Register an Organization
            </Link>
          </div>
        </div>

        <div className="absolute top-4 left-6 hidden lg:block w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-surface">
          <img 
            alt="Neighbor smiling warmly" 
            className="w-full h-full object-cover" 
            src="/images/6abb389d3804fbd99866b3f3_3.png" 
            onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1UHPraAHz2dhsBZFYj1Y-yTCwWmAd3cy56khzkDl7POQA9zQnYNykr88jJym_U43vQ9sIYj_wqmIeNg1TzAOuUsAff1AaiVV40Twj10OlHdFKRsMVztv_G38bsv1HqRH5XDdWfyrVCMj-1GUc7jNUgyGC1UyjyjYJHScNLKMRSuJSf5atgG_LIdEZALqBDo6uth9fvFT6KOcatZ14CrkJfNoYzXe_vEgw14Ki6um_TiMr2C3vo3EMuSYtFe")}
          />
        </div>
        <div className="absolute top-12 right-10 hidden lg:block w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-surface">
          <img 
            alt="Active neighbor outdoors" 
            className="w-full h-full object-cover" 
            src="/images/6abb389d3804fbd99866b3f3_4.png" 
            onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1V2O3wev8L3O43lDQxj7RflDb0SystBSzbkPZ74A-zJlI5rJF8t8IUTxREOPkCChrKkdIRaRq_9a9mOL_lX8MQXP_lvevnVndHRQZUXuocjFYAEKMHZQ6Uu-eNQfOq9nxmBmz8_Z7VX_hUsooQFL-9mTuwnb2u8jjLwFJaQ2IIimF6Iq6zgmD4ve78zc6R2muxaYY87hUKlvn6X0bShiaU2CMNiYRUzadmxJah8NFwAvQiDuF2PwOh0KIo")}
          />
        </div>
        <div className="absolute bottom-6 left-16 hidden lg:block w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-surface">
          <img 
            alt="Friendly neighbor volunteer waving hello" 
            className="w-full h-full object-cover" 
            src="/images/6abb389d3804fbd99866b3f3_6.png" 
            onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1XYShk1yhcm0p4D2UZFUUNwMroqNCd6S6sJLCulTvso-bYco9ksCfYsR4xUEDxutHdTBO8HPEChsnurHI4JhLhSE4SMWM0nUpExxwrf7_WRxY6Uf3d9ycNsGJ4C-fcEhEj0kWlTFxMlCJFOMiddqdhHyl9qgAIqG4m7lIH-KSpyBFVdv_EkM8DycT7Wch6JEo8M1ENzXETkCEHavvw-9nbVeNnzQgkRzS0lQiec_cJ4yh_Krx5l11mR6nw")}
          />
        </div>
        <div className="absolute bottom-8 right-20 hidden lg:block w-20 h-20 rounded-full overflow-hidden shadow-lg border-4 border-surface">
          <img 
            alt="Community participant smiling" 
            className="w-full h-full object-cover" 
            src="/images/6abb389d3804fbd99866b3f3_7.png" 
            onError={(e) => handleImgError(e, "https://lh3.googleusercontent.com/aida/AEtjO1VBmtfBTXay4-maTndagjNpWlF18s3H7mzDvj4SFeF4eXXRXj9ZfYUB8_G1BaygC_lL-Ju_ccTXsclV_XfzXElvi-uu3wHQlg9tgIbXgdcVEwbYmjB11-yOf2qHQKuZ0m1vUT_U5slMQfXQaE42ezTRWWOtKBJKV7-nJUoWg3Vp_kqKRoqr4jfnbDNztKYTbTrdO3hDmnO1FLTsNWUF7tYmoq04aaovJnSnVsbuouNIzL4R3L9ryO9zkw_J")}
          />
        </div>
      </div>
    </section>
  );
}
