# HTTP Client

Axios in `lib/api.ts` with interceptors — request interceptor adds Bearer token from `localStorage`, response interceptor handles 401 (clears auth and redirects to `/login`).
