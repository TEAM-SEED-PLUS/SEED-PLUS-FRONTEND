import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FeatureSection,
  HeroSection,
  LandingFooter,
  LandingHeader,
  ProcessSection,
  ReviewSection,
  UsageSection,
} from '@/components/landing';
import { useDocumentTitle, useLandingSnap } from '@/hooks';

const LandingPage = () => {
  const { hash } = useLocation();
  useDocumentTitle();
  useLandingSnap();

  // 회사 소개 등 다른 페이지에서 '/#about'처럼 섹션을 지정해 들어온 경우 그 섹션으로 내려간다.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

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
