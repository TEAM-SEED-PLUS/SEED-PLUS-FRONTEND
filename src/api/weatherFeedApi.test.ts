import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './httpClient';
import {
  getWeatherApiErrorMessage,
  getWeatherFeed,
  getWeatherOverview,
  toSafeLinkUrl,
  toWeatherContentItems,
} from './weatherFeedApi';

// httpClient는 브라우저 환경변수를 읽어 만들어지므로 테스트에서는 get만 대체한다.
vi.mock('./httpClient', () => ({ apiClient: { get: vi.fn() } }));
const mockedGet = vi.mocked(apiClient.get);

const springResponse = <T>(data: T) =>
  ({
    data: { status: 200, code: 2000, message: '요청 성공', data },
  }) as AxiosResponse;

const axiosErrorWith = (status: number, data: unknown, code?: string) => {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError('error', code, config, null, {
    status,
    statusText: '',
    headers: {},
    config,
    data,
  });
};

describe('상권날씨 백엔드 호출', () => {
  beforeEach(() => mockedGet.mockReset());

  it('상세는 백엔드 경로로 요청하고 공통 응답의 data를 꺼낸다', async () => {
    const feed = { schema_version: '1.0' };
    mockedGet.mockResolvedValue(springResponse(feed));

    await expect(
      getWeatherFeed({ district: '강남구', timeBand: '점심' })
    ).resolves.toBe(feed);
    expect(mockedGet).toHaveBeenCalledWith(
      '/api/v1/weather-feeds',
      expect.objectContaining({
        params: expect.objectContaining({
          district: '강남구',
          time_band: '점심',
        }),
      })
    );
  });

  it('overview도 공통 응답의 data를 꺼낸다', async () => {
    const overview = { status: 'ok', districts: [] };
    mockedGet.mockResolvedValue(springResponse(overview));

    await expect(getWeatherOverview({ timeBand: '아침' })).resolves.toBe(
      overview
    );
    expect(mockedGet).toHaveBeenCalledWith(
      '/api/v1/weather-feeds/overview',
      expect.objectContaining({
        params: expect.objectContaining({ time_band: '아침' }),
      })
    );
  });
});

describe('getWeatherApiErrorMessage', () => {
  it('AI 서버 연결 실패(502·9600)는 분석 서버 응답 없음으로 안내한다', () => {
    expect(
      getWeatherApiErrorMessage(axiosErrorWith(502, { code: 9600 }))
    ).toContain('분석 서버가 응답하지 않습니다');
  });

  it('잘못된 조회 조건(400)은 조건 확인을 안내한다', () => {
    expect(getWeatherApiErrorMessage(axiosErrorWith(400, {}))).toContain(
      '조회 조건'
    );
  });

  it('요청 시간 초과는 지연 안내를 한다', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED');
    expect(getWeatherApiErrorMessage(error)).toContain('지연');
  });
});

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
