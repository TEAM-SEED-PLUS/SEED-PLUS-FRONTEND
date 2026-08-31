import { useEffect } from 'react';
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

  // 스냅은 랜딩에서만 동작해야 하므로 이 페이지에 머무는 동안만 html에 붙인다.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('landing-snap');
    return () => root.classList.remove('landing-snap');
  }, []);

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
