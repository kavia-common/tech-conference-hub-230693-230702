import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { combineLatest, map, switchMap } from 'rxjs';
import { SpeakersService } from '../../services/speakers.service';
import { SessionsService } from '../../services/sessions.service';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SessionListComponent } from '../../shared/sessions/session-list.component';

@Component({
  selector: 'app-speaker-detail-page',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, NgFor, BadgeComponent, ButtonComponent, SessionListComponent],
  styles: [`
    .hero {
      padding: 18px;
      display: grid;
      grid-template-columns: 0.25fr 0.75fr;
      gap: 14px;
      align-items: start;
    }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 26px;
      box-shadow: var(--shadow-md);
    }
    .name {
      font-size: 1.6rem;
      font-weight: 950;
      letter-spacing: -0.03em;
    }
    .role {
      margin-top: 4px;
      opacity: 0.9;
      font-weight: 750;
    }
    .bio {
      margin-top: 12px;
      line-height: 1.6;
      opacity: 0.95;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .actions {
      margin-top: 14px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    @media (max-width: 820px) {
      .hero { grid-template-columns: 1fr; }
      .avatar { width: 72px; height: 72px; }
    }
  `],
  template: `
    <section class="page">
      <div class="container" *ngIf="vm$ | async as vm; else loading">
        <div class="actions">
          <a routerLink="/speakers"><app-button variant="ghost">← Back to speakers</app-button></a>
          <a routerLink="/schedule"><app-button variant="secondary">Browse schedule</app-button></a>
        </div>

        <div class="surface hero" style="margin-top: 12px;">
          <div class="avatar" [style.background]="vm.speaker.avatarBg" aria-hidden="true"></div>
          <div>
            <div class="name">{{ vm.speaker.name }}</div>
            <div class="role">{{ vm.speaker.title }} · {{ vm.speaker.company }}</div>

            <div class="tags" aria-label="Speaker tracks">
              <app-badge *ngFor="let t of vm.speaker.tags; let i = index" [variant]="i % 2 === 0 ? 'primary' : 'secondary'">
                {{ t }}
              </app-badge>
            </div>

            <p class="bio">{{ vm.speaker.bio }}</p>
          </div>
        </div>

        <div class="hr"></div>

        <h2 class="section__title">Sessions by {{ vm.speaker.name }}</h2>
        <app-session-list [sessions]="vm.sessions"></app-session-list>

        <div class="hr"></div>

        <div class="alert" *ngIf="vm.speaker.social?.website || vm.speaker.social?.linkedin || vm.speaker.social?.x">
          <strong>Find {{ vm.speaker.name }} online:</strong>
          <ul style="margin-top: 8px; padding-left: 18px;">
            <li *ngIf="vm.speaker.social?.website"><a [href]="vm.speaker.social?.website" target="_blank" rel="noreferrer">Website</a></li>
            <li *ngIf="vm.speaker.social?.linkedin"><a [href]="vm.speaker.social?.linkedin" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li *ngIf="vm.speaker.social?.x"><a [href]="vm.speaker.social?.x" target="_blank" rel="noreferrer">X</a></li>
          </ul>
        </div>
      </div>

      <ng-template #loading>
        <div class="container">
          <div class="alert">Loading speaker…</div>
        </div>
      </ng-template>
    </section>
  `,
})
export class SpeakerDetailPage {
  private route = inject(ActivatedRoute);
  private speakersService = inject(SpeakersService);
  private sessionsService = inject(SessionsService);

  vm$ = this.route.paramMap.pipe(
    map((p) => p.get('id') ?? ''),
    switchMap((id) =>
      combineLatest([this.speakersService.getSpeakerById(id), this.sessionsService.getSessions()]).pipe(
        map(([speaker, sessions]) => {
          if (!speaker) {
            throw new Error('Speaker not found');
          }
          return {
            speaker,
            sessions: sessions.filter((s) => s.speakerIds.includes(speaker.id)),
          };
        }),
      ),
    ),
  );
}
