import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Speaker } from '../models/conference.models';
import { MOCK_SPEAKERS } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class SpeakersService {
  // PUBLIC_INTERFACE
  getSpeakers(): Observable<Speaker[]> {
    /** Returns the list of speakers (mocked). */
    return of(MOCK_SPEAKERS);
  }

  // PUBLIC_INTERFACE
  getSpeakerById(id: string): Observable<Speaker | undefined> {
    /** Returns a single speaker by id (mocked). */
    return of(MOCK_SPEAKERS.find((s) => s.id === id));
  }
}
