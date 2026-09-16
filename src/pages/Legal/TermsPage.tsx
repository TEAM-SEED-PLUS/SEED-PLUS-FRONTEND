import { termsOfServiceDocument } from '@/content/termsOfServiceContent';
import { useDocumentTitle } from '@/hooks';
import LegalDocumentView from './LegalDocumentView';
import LegalPageLayout from './LegalPageLayout';

const TermsPage = () => {
  useDocumentTitle('서비스 이용약관');

  return (
    <LegalPageLayout
      title={termsOfServiceDocument.title}
      effectiveDate={termsOfServiceDocument.effectiveDate}
      intro={termsOfServiceDocument.intro}
      counterpart={{ to: '/privacy', label: '개인정보처리방침' }}
    >
      <LegalDocumentView sections={termsOfServiceDocument.sections} />
    </LegalPageLayout>
  );
};

export default TermsPage;
