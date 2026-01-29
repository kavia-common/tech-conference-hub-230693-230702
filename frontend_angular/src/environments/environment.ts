export const environment = {
  production: false,

  /**
   * Placeholder API base URLs (not required to be live).
   * Set via container env:
   * - NG_APP_API_BASE
   * - NG_APP_BACKEND_URL
   */
  apiBase: (globalThis as any)?.process?.env?.['NG_APP_API_BASE'] ?? '',
  backendUrl: (globalThis as any)?.process?.env?.['NG_APP_BACKEND_URL'] ?? '',
};
