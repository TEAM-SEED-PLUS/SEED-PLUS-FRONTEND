import { describe, expect, it } from 'vitest';
import { toSafeLinkUrl, toWeatherContentItems } from './weatherFeedApi';

describe('toSafeLinkUrl', () => {
  it('http(s) 주소는 그대로 통과시킨다', () => {
    expect(toSafeLinkUrl('https://blog.naver.com/a/1')).toBe(
      'https://blog.naver.com/a/1'
    );
    expect(toSafeLinkUrl(' http://www.spacec.co.kr/gallery ')).toBe(
      'http://www.spacec.co.kr/gallery'
    );
  });

  it('비어 있거나 잘못된 주소, http(s)가 아닌 프로토콜은 버린다', () => {
    expect(toSafeLinkUrl(null)).toBeUndefined();
    expect(toSafeLinkUrl(undefined)).toBeUndefined();
    expect(toSafeLinkUrl('')).toBeUndefined();
    expect(toSafeLinkUrl('www.example.com')).toBeUndefined();
    expect(toSafeLinkUrl('javascript:alert(1)')).toBeUndefined();
  });
});

describe('toWeatherContentItems', () => {
  it('link_url을 linkUrl로 옮기고, 없으면 비워둔다', () => {
    const [withLink, withoutLink] = toWeatherContentItems([
      {
        id: '1',
        type: 'event',
        title: '전시',
        period: null,
        place: null,
        thumbnail_url: null,
        link_url: 'https://example.com/event',
      },
      {
        id: '2',
        type: 'festival',
        title: '축제',
        period: null,
        place: null,
        thumbnail_url: null,
      },
    ]);
    expect(withLink.linkUrl).toBe('https://example.com/event');
    expect(withoutLink.linkUrl).toBeUndefined();
  });
});
