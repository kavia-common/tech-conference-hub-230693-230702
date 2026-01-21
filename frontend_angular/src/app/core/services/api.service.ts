import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config';
import { Session, Speaker, TicketType, VenueInfo } from '../models/conference.models';

/**
 * ApiService is an HttpClient-backed stub for a future backend.
 * It mirrors the API surface of the in-memory data service so the rest of the app can
 * swap between mock and API with minimal changes.
 *
 * NOTE: Endpoints are placeholders; adjust paths when a real backend is available.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  private baseUrl(): string | null {
    // Prefer NG_APP_API_BASE, fall back to NG_APP_BACKEND_URL (both can be runtime-injected).
    const raw = this.config.apiBase ?? this.config.backendUrl;
    const url = raw?.trim() ?? '';
    return url.length ? url.replace(/\/+$/, '') : null;
  }

  private url(path: string): string {
    const base = this.baseUrl();
    if (!base) {
      // Guard: callers should only use ApiService when a baseUrl is configured.
      throw new Error('ApiService base URL is not configured (set NG_APP_API_BASE or NG_APP_BACKEND_URL).');
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  // PUBLIC_INTERFACE
  getSpeakers() {
    /** Fetch all speakers from the backend (stub). */
    return this.http.get<Speaker[]>(this.url('/speakers'));
  }

  // PUBLIC_INTERFACE
  getSpeakerById(id: string) {
    /** Fetch speaker detail (stub). */
    return this.http.get<Speaker>(this.url(`/speakers/${encodeURIComponent(id)}`));
  }

  // PUBLIC_INTERFACE
  getSessions() {
    /** Fetch all sessions from the backend (stub). */
    return this.http.get<Session[]>(this.url('/sessions'));
  }

  // PUBLIC_INTERFACE
  getSessionById(id: string) {
    /** Fetch session detail (stub). */
    return this.http.get<Session>(this.url(`/sessions/${encodeURIComponent(id)}`));
  }

  // PUBLIC_INTERFACE
  getSessionsForSpeaker(speakerId: string) {
    /** Fetch sessions for a speaker (stub). */
    return this.http.get<Session[]>(this.url(`/speakers/${encodeURIComponent(speakerId)}/sessions`));
  }

  // PUBLIC_INTERFACE
  getTicketTypes() {
    /** Fetch ticket types (stub). */
    return this.http.get<TicketType[]>(this.url('/tickets/types'));
  }

  // PUBLIC_INTERFACE
  getVenueInfo() {
    /** Fetch venue info (stub). */
    return this.http.get<VenueInfo>(this.url('/venue'));
  }
}
