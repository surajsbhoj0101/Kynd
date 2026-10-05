import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroBanner from './components/landing-page/HeroBanner';
import AboutMutualAid from './components/landing-page/AboutMutualAid';
import ParticipationGrid from './components/landing-page/ParticipationGrid';
import CommunityShowcase from './components/landing-page/CommunityShowcase';
import TrustAndFaq from './components/landing-page/TrustAndFaq';
import CtaBanner from './components/landing-page/CtaBanner';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased">
      <Navbar />
      <main className="flex-grow pt-20">
        <HeroBanner />
        <AboutMutualAid />
        <ParticipationGrid />
        <CommunityShowcase />
        <TrustAndFaq />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}