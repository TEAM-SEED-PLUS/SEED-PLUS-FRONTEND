import {
  FeatureSection,
  HeroSection,
  LandingFooter,
  LandingHeader,
  ProcessSection,
  ReviewSection,
  UsageSection,
} from '@/components/landing';
import { useDocumentTitle } from '@/hooks';

const LandingPage = () => {
  useDocumentTitle();

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeatureSection />
        <UsageSection />
        <ProcessSection />
        <ReviewSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
