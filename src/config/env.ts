/**
 * Configuración central de conexión con el backend de TuristeaYa en Render
 * y el proyecto de Supabase asociado (xjdiwevkbcvakmqjyzuv).
 */

const rawBaseUrl =
  process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '') ||
  'https://backend-turisteaya.onrender.com';

export const ENV = {
  API_BASE_URL: rawBaseUrl,
  API_V1_PREFIX: '/api/v1',
  API_V1_URL: `${rawBaseUrl}/api/v1`,
  HEALTH_URL: `${rawBaseUrl}/health`,
  SUPABASE_PROJECT_ID:
    process.env.EXPO_PUBLIC_SUPABASE_PROJECT_ID?.trim() || 'xjdiwevkbcvakmqjyzuv',
  SUPABASE_URL:
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, '') ||
    'https://xjdiwevkbcvakmqjyzuv.supabase.co',
  REQUEST_TIMEOUT_MS: 25000,
} as const;
