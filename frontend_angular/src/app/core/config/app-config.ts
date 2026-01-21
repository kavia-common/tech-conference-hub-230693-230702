import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Typed configuration object for the app.
 * Values are sourced from NG_APP_* environment variables at runtime:
 *  - In the browser: from `window.__env` (set in index.html or server-side).
 *  - On the server (SSR): from `process.env`.
 */
export interface AppConfig {
  apiBase: string | null;
  backendUrl: string | null;
  frontendUrl: string | null;
  wsUrl: string | null;

  nodeEnv: string | null;
  nextTelemetryDisabled: boolean;
  enableSourceMaps: boolean;
  port: number | null;
  trustProxy: boolean;
  logLevel: string | null;
  healthcheckPath: string | null;

  featureFlags: Record<string, boolean>;
  experimentsEnabled: boolean;
}

type EnvMap = Record<string, string | undefined>;

// PUBLIC_INTERFACE
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

/**
 * Attempt to parse a boolean value from env.
 * Accepts: "1|true|yes|on" => true, "0|false|no|off" => false (case-insensitive).
 */
function parseBoolean(value: string | undefined): boolean {
  if (value == null) return false;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return false;
}

function parseNumber(value: string | undefined): number | null {
  if (value == null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseFeatureFlags(value: string | undefined): Record<string, boolean> {
  if (!value) return {};
  // Supported formats:
  // - JSON object: {"newNav":true,"beta":false}
  // - Comma list: featureA,featureB  (implies true)
  // - Comma list with =: featureA=true,featureB=false
  const trimmed = value.trim();
  if (!trimmed) return {};
  try {
    const maybeObj = JSON.parse(trimmed) as unknown;
    if (maybeObj && typeof maybeObj === 'object' && !Array.isArray(maybeObj)) {
      const out: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(maybeObj as Record<string, unknown>)) {
        out[k] = Boolean(v);
      }
      return out;
    }
  } catch {
    // fall through to list parsing
  }

  const flags: Record<string, boolean> = {};
  for (const part of trimmed.split(',').map((p) => p.trim()).filter(Boolean)) {
    const [k, v] = part.split('=').map((p) => p.trim());
    if (!k) continue;
    flags[k] = v == null || v === '' ? true : parseBoolean(v);
  }
  return flags;
}

function pickEnv(platformId: object): EnvMap {
  // Browser: use a global injected by index.html or server.
  if (isPlatformBrowser(platformId)) {
    const w = globalThis as unknown as { __env?: EnvMap };
    const envFromWindow = (w && typeof w === 'object' && '__env' in w) ? (w as any).__env : undefined;
    return (envFromWindow && typeof envFromWindow === 'object') ? envFromWindow : {};
  }

  // Server SSR: use process.env
  const p = globalThis as unknown as { process?: { env?: EnvMap } };
  return p?.process?.env ?? {};
}

// PUBLIC_INTERFACE
export function provideAppConfig() {
  /**
   * Provider factory that reads runtime env values.
   * Keep this as a function so it can be imported from app.config.ts.
   */
  return {
    provide: APP_CONFIG,
    useFactory: (): AppConfig => {
      const platformId = inject(PLATFORM_ID);
      const env = pickEnv(platformId);

      return {
        apiBase: env['NG_APP_API_BASE'] ?? null,
        backendUrl: env['NG_APP_BACKEND_URL'] ?? null,
        frontendUrl: env['NG_APP_FRONTEND_URL'] ?? null,
        wsUrl: env['NG_APP_WS_URL'] ?? null,

        nodeEnv: env['NG_APP_NODE_ENV'] ?? null,
        nextTelemetryDisabled: parseBoolean(env['NG_APP_NEXT_TELEMETRY_DISABLED']),
        enableSourceMaps: parseBoolean(env['NG_APP_ENABLE_SOURCE_MAPS']),
        port: parseNumber(env['NG_APP_PORT']),
        trustProxy: parseBoolean(env['NG_APP_TRUST_PROXY']),
        logLevel: env['NG_APP_LOG_LEVEL'] ?? null,
        healthcheckPath: env['NG_APP_HEALTHCHECK_PATH'] ?? null,

        featureFlags: parseFeatureFlags(env['NG_APP_FEATURE_FLAGS']),
        experimentsEnabled: parseBoolean(env['NG_APP_EXPERIMENTS_ENABLED']),
      };
    },
  };
}
