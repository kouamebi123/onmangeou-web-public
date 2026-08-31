const DEFAULT_API_ORIGIN = 'https://onmangeou-backend-api-production.up.railway.app';
const API_PREFIX = '/api/v1';

/**
 * Base de l'API publique.
 *
 * Le backend expose `API_BASE_URL=http://localhost:3000` (origine seule). Si
 * cette variable fuit dans le processus Next, `new URL(chemin, base)` remplace
 * le dernier segment et produit `/discovery/...` au lieu de `/api/v1/discovery`.
 * On normalise donc toujours vers `.../api/v1`.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.API_BASE_URL ?? process.env.ONMANGEOU_API_BASE_URL;
  const origin = (configured === undefined || configured.trim() === ''
    ? DEFAULT_API_ORIGIN
    : configured.trim()
  ).replace(/\/$/, '');

  return origin.endsWith(API_PREFIX) ? origin : `${origin.replace(/\/api\/v1$/, '')}${API_PREFIX}`;
}

export function apiUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
  const relative = path.replace(/^\//, '');
  const url = new URL(`${getApiBaseUrl()}/${relative}`);

  if (query !== undefined) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
