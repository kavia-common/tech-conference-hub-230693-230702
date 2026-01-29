import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Session } from '../models/conference.models';
import { MOCK_SESSIONS } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class SessionsService {
  // PUBLIC_INTERFACE
  getSessions(): Observable<Session[]> {
    /** Returns the list of sessions (mocked). */
    return of(MOCK_SESSIONS);
  }

  // PUBLIC_INTERFACE
  getSessionById(id: string): Observable<Session | undefined> {
    /** Returns a single session by id (mocked). */
    return of(MOCK_SESSIONS.find((s) => s.id === id));
  }
}
