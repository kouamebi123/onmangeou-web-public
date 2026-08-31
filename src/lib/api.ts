import { apiUrl } from '@/lib/env';
import { t } from '@/lib/i18n';
import type { DiscoverRestaurantsQuery, RestaurantDetail, RestaurantSummary } from '@/lib/types';

export interface ApiMeta {
  requestId: string;
  nextCursor: string | null;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: ApiMeta;
}

export interface ProblemField {
  field: string;
  code: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  requestId: string;
  fields: ProblemField[];
}

export class ApiProblemError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.name = 'ApiProblemError';
    this.problem = problem;
  }
}

export class ApiNetworkError extends Error {
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'ApiNetworkError';
    this.cause = cause;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isProblemDetails(value: unknown): value is ProblemDetails {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.type === 'string' &&
    typeof value.title === 'string' &&
    typeof value.status === 'number' &&
    typeof value.code === 'string' &&
    typeof value.detail === 'string'
  );
}

function toProblemDetails(value: ProblemDetails): ProblemDetails {
  return {
    type: value.type,
    title: value.title,
    status: value.status,
    code: value.code,
    detail: value.detail,
    requestId: typeof value.requestId === 'string' ? value.requestId : '',
    fields: Array.isArray(value.fields) ? value.fields : [],
  };
}

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  if (!isRecord(value) || !('data' in value) || !isRecord(value.meta)) {
    return false;
  }

  return typeof value.meta.requestId === 'string';
}

function fallbackProblem(status: number): ProblemDetails {
  return {
    type: 'about:blank',
    title: t('errors.unavailableTitle'),
    status,
    code: 'INTERNAL_ERROR',
    detail: t('errors.unavailableDetail'),
    requestId: '',
    fields: [],
  };
}

function invalidEnvelopeProblem(): ProblemDetails {
  return {
    type: 'about:blank',
    title: t('errors.unavailableTitle'),
    status: 502,
    code: 'INTERNAL_ERROR',
    detail: t('errors.invalidResponse'),
    requestId: '',
    fields: [],
  };
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiProblemError && error.problem.status === 404;
}

export function errorMessage(error: unknown): { title: string; detail: string } {
  if (error instanceof ApiProblemError) {
    return { title: error.problem.title, detail: error.problem.detail };
  }

  if (error instanceof ApiNetworkError) {
    return { title: t('errors.title'), detail: error.message };
  }

  return { title: t('errors.title'), detail: t('errors.detail') };
}

export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<ApiEnvelope<T>> {
  const url = apiUrl(path, query);

  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch (cause) {
    throw new ApiNetworkError(t('errors.network'), cause);
  }

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    if (isProblemDetails(body)) {
      throw new ApiProblemError(toProblemDetails(body));
    }

    throw new ApiProblemError(fallbackProblem(response.status));
  }

  if (!isEnvelope<T>(body)) {
    throw new ApiProblemError(invalidEnvelopeProblem());
  }

  return {
    data: body.data,
    meta: {
      requestId: body.meta.requestId,
      nextCursor: typeof body.meta.nextCursor === 'string' ? body.meta.nextCursor : null,
    },
  };
}

export function discoverRestaurants(
  query: DiscoverRestaurantsQuery,
): Promise<ApiEnvelope<RestaurantSummary[]>> {
  return apiGet<RestaurantSummary[]>('/discovery/restaurants', {
    q: query.q,
    city: query.city,
    district: query.district,
    openNow: query.openNow,
    service: query.service,
    sort: query.sort,
    limit: query.limit,
    cursor: query.cursor,
  });
}

export function getRestaurantBySlug(slug: string): Promise<ApiEnvelope<RestaurantDetail>> {
  return apiGet<RestaurantDetail>(`/restaurants/${encodeURIComponent(slug)}`);
}

export function getRestaurantReviews(establishmentId: string) {
  return apiGet<Array<{ id: string; score: number; body: string | null; author_name: string | null }>>(
    `/restaurants/${establishmentId}/reviews`,
  );
}

export function getRestaurantEvents(establishmentId: string) {
  return apiGet<Array<{ id: string; title: string; body: string | null; starts_at: string }>>(
    `/restaurants/${establishmentId}/events`,
  );
}
