import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { MarketPreview } from '@/components/landing/MarketPreview';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <MarketPreview />
      <Footer />
    </main>
  );
}
