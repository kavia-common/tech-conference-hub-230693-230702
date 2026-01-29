import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  // PUBLIC_INTERFACE
  getApiBase(): string {
    /** Returns configured API base URL placeholder (may be empty). */
    return environment.apiBase ?? '';
  }

  // PUBLIC_INTERFACE
  getBackendUrl(): string {
    /** Returns configured backend URL placeholder (may be empty). */
    return environment.backendUrl ?? '';
  }
}
