import { privacyPolicyDocument } from '@/content/privacyPolicyContent';
import { useDocumentTitle } from '@/hooks';
import LegalDocumentView from './LegalDocumentView';
import LegalPageLayout from './LegalPageLayout';

const PrivacyPolicyPage = () => {
  useDocumentTitle('개인정보처리방침');

  return (
    <LegalPageLayout
      title={privacyPolicyDocument.title}
      effectiveDate={privacyPolicyDocument.effectiveDate}
      intro={privacyPolicyDocument.intro}
      counterpart={{ to: '/terms', label: '서비스 이용약관' }}
    >
      <LegalDocumentView sections={privacyPolicyDocument.sections} />
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
