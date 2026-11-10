import { useEffect } from 'react';
import {
  CompanyApproachSection,
  CompanyFirstStepSection,
  CompanyHeroSection,
  CompanyValuesSection,
  CompanyWhySection,
} from '@/components/company';
import { LandingFooter, LandingHeader } from '@/components/landing';
import { useDocumentTitle, useLandingSnap } from '@/hooks';

const CompanyPage = () => {
  useDocumentTitle('회사 소개');
  useLandingSnap();

  // 랜딩 푸터(페이지 맨 아래)에서 넘어오므로 스크롤을 맨 위로 되돌린다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <CompanyHeroSection />
        <CompanyWhySection />
        <CompanyApproachSection />
        <CompanyFirstStepSection />
        <CompanyValuesSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default CompanyPage;
