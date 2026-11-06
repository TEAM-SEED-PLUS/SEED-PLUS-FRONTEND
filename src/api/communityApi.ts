import { apiClient } from './httpClient';

// 커뮤니티(피드 > 소통) API(BE #51).
// 조회는 비로그인도 가능하고, 작성·삭제·댓글·좋아요는 로그인(Bearer)이 필요하다. CSRF 대상은 아니다.
type ApiResponse<T> = {
  status: number | string;
  code: number;
  message: string;
  data: T;
};

export type CommunityPageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  isLast: boolean;
};

type PageResponse<T> = {
  content: T[];
  pageInfo: CommunityPageInfo;
};

export type CommunityAuthor = {
  userId: number;
  userName: string;
};

export type CommunityRegionTag = {
  regionId: number;
  sido: string;
  sigungu: string;
};

export type CommunityIndustryTag = {
  industryId: number;
  name: string;
  level: 'LARGE' | 'MEDIUM' | 'SMALL';
};

type CommunityPostBase = {
  postId: number;
  author: CommunityAuthor;
  title: string;
  location: string | null;
  regionTags: CommunityRegionTag[];
  industryTags: CommunityIndustryTag[];
  likeCount: number;
  commentCount: number;
  liked: boolean;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommunityPostSummary = CommunityPostBase & {
  /** 본문 앞 200자 */
  contentSummary: string;
};

export type CommunityPostDetail = CommunityPostBase & {
  content: string;
};

export type CommunityComment = {
  commentId: number;
  postId: number;
  author: CommunityAuthor;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaveCommunityPostRequest = {
  title: string;
  content: string;
  location?: string;
};

/** BE 입력 제한 (SaveCommunityPostRequest / CreateCommunityCommentRequest) */
export const COMMUNITY_LIMITS = {
  title: 100,
  content: 10000,
  location: 200,
  comment: 2000,
  /** 목록 contentSummary가 잘리는 길이 */
  summary: 200,
} as const;

const POST_PAGE_SIZE = 20;
const COMMENT_PAGE_SIZE = 50;

/** 게시글 목록 — 최신순(createdAt,desc) */
export const fetchCommunityPosts = async (page = 0) => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<CommunityPostSummary>>
  >('/api/v1/community/posts', {
    params: { page, size: POST_PAGE_SIZE, sort: 'createdAt,desc' },
  });
  return response.data.data;
};

export const fetchCommunityPost = async (postId: number) => {
  const response = await apiClient.get<ApiResponse<CommunityPostDetail>>(
    `/api/v1/community/posts/${postId}`
  );
  return response.data.data;
};

export const createCommunityPost = async (
  payload: SaveCommunityPostRequest
) => {
  const response = await apiClient.post<ApiResponse<CommunityPostDetail>>(
    '/api/v1/community/posts',
    payload
  );
  return response.data.data;
};

export const deleteCommunityPost = async (postId: number) => {
  await apiClient.delete(`/api/v1/community/posts/${postId}`);
};

/** 댓글 목록 — 작성 시각 오름차순 */
export const fetchCommunityComments = async (postId: number, page = 0) => {
  const response = await apiClient.get<
    ApiResponse<PageResponse<CommunityComment>>
  >(`/api/v1/community/posts/${postId}/comments`, {
    params: { page, size: COMMENT_PAGE_SIZE },
  });
  return response.data.data;
};

export const createCommunityComment = async (
  postId: number,
  content: string
) => {
  const response = await apiClient.post<ApiResponse<CommunityComment>>(
    `/api/v1/community/posts/${postId}/comments`,
    { content }
  );
  return response.data.data;
};

export const deleteCommunityComment = async (
  postId: number,
  commentId: number
) => {
  await apiClient.delete(
    `/api/v1/community/posts/${postId}/comments/${commentId}`
  );
};

/** 좋아요 등록·취소는 BE가 멱등 처리한다 */
export const likeCommunityPost = async (postId: number) => {
  await apiClient.post(`/api/v1/community/posts/${postId}/likes`);
};

export const unlikeCommunityPost = async (postId: number) => {
  await apiClient.delete(`/api/v1/community/posts/${postId}/likes`);
};
