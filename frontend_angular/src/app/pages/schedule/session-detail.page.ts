import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe, NgIf, NgFor } from '@angular/common';
import { combineLatest, map, switchMap } from 'rxjs';
import { SessionsService } from '../../services/sessions.service';
import { SpeakersService } from '../../services/speakers.service';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-session-detail-page',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, NgIf, NgFor, BadgeComponent, ButtonComponent, CardComponent],
  styles: [`
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      align-items: center;
    }

    .title {
      font-size: 1.6rem;
      font-weight: 950;
      letter-spacing: -0.03em;
    }

    .desc {
      margin-top: 12px;
      line-height: 1.65;
      opacity: 0.95;
    }

    .speakerRow {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 16px;
      box-shadow: var(--shadow-sm);
      flex: 0 0 auto;
    }

    .speakerName {
      font-weight: 900;
    }

    .actions {
      margin-bottom: 12px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
  `],
  template: `
    <section class="page">
      <div class="container" *ngIf="vm$ | async as vm; else loading">
        <div class="actions">
          <a routerLink="/schedule"><app-button variant="ghost">← Back to schedule</app-button></a>
          <a routerLink="/tickets"><app-button variant="secondary">Get tickets</app-button></a>
        </div>

        <div class="surface" style="padding: 18px;">
          <div class="kicker">Session</div>
          <div class="title">{{ vm.session.title }}</div>

          <div class="meta" aria-label="Session metadata">
            <span class="badge badge--secondary">{{ vm.session.room }}</span>
            <span class="badge">{{ vm.session.startsAtIso | date:'EEE, MMM d · HH:mm':'UTC' }} (UTC)</span>
            <app-badge variant="primary">{{ vm.session.track }}</app-badge>
            <app-badge variant="secondary">{{ vm.session.level }}</app-badge>
            <span class="badge" *ngFor="let t of vm.session.tags">{{ t }}</span>
          </div>

          <p class="desc">{{ vm.session.description }}</p>
        </div>

        <div class="hr"></div>

        <h2 class="section__title">Speakers</h2>
        <div class="grid cols-2">
          <app-card *ngFor="let sp of vm.speakers" [ariaLabel]="'Speaker ' + sp.name">
            <div class="speakerRow">
              <div class="avatar" [style.background]="sp.avatarBg" aria-hidden="true"></div>
              <div>
                <div class="speakerName">{{ sp.name }}</div>
                <div class="muted">{{ sp.title }} · {{ sp.company }}</div>
                <a [routerLink]="['/speakers', sp.id]" style="display:inline-flex; margin-top:6px; text-decoration: underline; font-weight: 800;">
                  View profile
                </a>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <ng-template #loading>
        <div class="container">
          <div class="alert">Loading session…</div>
        </div>
      </ng-template>
    </section>
  `,
})
export class SessionDetailPage {
  private route = inject(ActivatedRoute);
  private sessionsService = inject(SessionsService);
  private speakersService = inject(SpeakersService);

  vm$ = this.route.paramMap.pipe(
    map((p) => p.get('id') ?? ''),
    switchMap((id) =>
      combineLatest([this.sessionsService.getSessionById(id), this.speakersService.getSpeakers()]).pipe(
        map(([session, speakers]) => {
          if (!session) {
            throw new Error('Session not found');
          }
          return {
            session,
            speakers: speakers.filter((sp) => session.speakerIds.includes(sp.id)),
          };
        }),
      ),
    ),
  );
}
