/**
 * 다른 화면의 모바일 메뉴에서 내 상가 만들기로 넘어올 때 함께 넘기는 요청.
 * 라우터 state로 전달하고, 내 상가 만들기 화면이 처음 열릴 때 한 번 읽는다.
 */
export type StoreBuilderIntent = {
  openCalculator?: 'revenue' | 'survival';
  industryId?: number;
  regionId?: number;
};

export const readStoreBuilderIntent = (state: unknown): StoreBuilderIntent => {
  if (typeof state !== 'object' || state === null) {
    return {};
  }

  const { openCalculator, industryId, regionId } = state as Record<
    string,
    unknown
  >;

  return {
    openCalculator:
      openCalculator === 'revenue' || openCalculator === 'survival'
        ? openCalculator
        : undefined,
    industryId: typeof industryId === 'number' ? industryId : undefined,
    regionId: typeof regionId === 'number' ? regionId : undefined,
  };
};
