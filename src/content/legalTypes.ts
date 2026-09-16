// 법적 고지 문서(이용약관·개인정보처리방침) 공통 표현 타입.
// 문구는 법무 검토를 거친 원문을 옮긴 것이므로 화면 사정으로 임의 수정하지 않는다.

export type LegalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  /** 강조 안내 박스. 주의·제한 사항처럼 놓치면 안 되는 문장에 쓴다. */
  | { kind: 'notice'; text: string };

export type LegalSection = {
  /** 목차 앵커 id (예: 'purpose') */
  id: string;
  /** 조문 번호를 포함한 제목 (예: '제1조 (개인정보의 처리 목적)') */
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  /** 문서 상단 안내 문단 */
  intro: string[];
  effectiveDate: string;
  sections: LegalSection[];
};
