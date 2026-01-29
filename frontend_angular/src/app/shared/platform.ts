import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// PUBLIC_INTERFACE
export function isBrowser(): boolean {
  /** Returns true only when running in the browser (SSR-safe guard). */
  const platformId = inject(PLATFORM_ID);
  return isPlatformBrowser(platformId);
}
