import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { SessionsService } from '../../services/sessions.service';
import { SessionListComponent } from '../../shared/sessions/session-list.component';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [AsyncPipe, NgIf, SessionListComponent],
  template: `
    <section class="page">
      <div class="container">
        <h1 class="page__title">Schedule</h1>
        <p class="page__subtitle">Pick your favorites, explore tracks, and dive into session details.</p>

        <div *ngIf="sessions$ | async as sessions; else loading">
          <app-session-list [sessions]="sessions"></app-session-list>
        </div>

        <ng-template #loading>
          <div class="alert">Loading schedule…</div>
        </ng-template>
      </div>
    </section>
  `,
})
export class SchedulePage {
  private sessionsService = inject(SessionsService);
  sessions$ = this.sessionsService.getSessions();
}
