export const environment = {
  production: true,
  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? '',
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? '',
};
