import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConferenceDataService } from '../../core/services/conference-data.service';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <a class="back" routerLink="/schedule" aria-label="Back to schedule">← Back to Schedule</a>

      <ng-container *ngIf="session(); else notFound">
        <div class="card">
          <div class="badge">{{ dayLabel(session()!.day) }} • {{ session()!.startTime }}–{{ session()!.endTime }}</div>

          <h1 class="title">{{ session()!.title }}</h1>

          <div class="meta">
            <span class="pill pill--soft">Room: {{ session()!.room }}</span>
            <span class="pill pill--soft">Track: {{ trackLabel(session()!.track) }}</span>
          </div>

          <p class="abstract">{{ session()!.abstract }}</p>
        </div>

        <div class="card">
          <h2 class="h2">Speakers</h2>

          <div class="speaker-grid">
            <a
              class="speaker"
              *ngFor="let sp of speakers()"
              [routerLink]="['/speakers', sp.id]"
              [attr.aria-label]="'Open speaker ' + sp.name"
            >
              <img class="avatar" [src]="sp.photoUrl" [alt]="sp.name" loading="lazy" />
              <div class="speaker__meta">
                <div class="speaker__name">{{ sp.name }}</div>
                <div class="speaker__title">{{ sp.title }} • {{ sp.company }}</div>
              </div>
            </a>
          </div>

          <div class="empty" *ngIf="!speakers().length">
            Speaker details coming soon.
          </div>
        </div>
      </ng-container>

      <ng-template #notFound>
        <div class="not-found">
          <h1 class="title">Session not found</h1>
          <p class="muted">That session doesn’t exist (yet). Try another one from the schedule.</p>
          <a class="button" routerLink="/schedule">Browse Schedule</a>
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 22px 16px 10px;
      }

      .back {
        display: inline-flex;
        text-decoration: none;
        color: rgba(55, 65, 81, 0.85);
        font-weight: 650;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
        box-shadow: var(--tc-shadow-sm);
      }
      .back:hover {
        border-color: rgba(70, 203, 236, 0.45);
      }

      .card {
        margin-top: 14px;
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .badge {
        display: inline-flex;
        width: fit-content;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--tc-gradient);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 800;
        color: rgba(55, 65, 81, 0.95);
      }

      .title {
        margin-top: 10px;
        letter-spacing: -0.02em;
        line-height: 1.1;
        font-size: clamp(26px, 3.5vw, 40px);
        color: var(--tc-text);
      }

      .meta {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 750;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.8);
        color: rgba(55, 65, 81, 0.85);
      }
      .pill--soft {
        background: rgba(253, 242, 248, 0.65);
      }

      .abstract {
        margin-top: 12px;
        line-height: 1.75;
        color: rgba(55, 65, 81, 0.85);
        max-width: 80ch;
      }

      .h2 {
        font-size: 18px;
        letter-spacing: -0.01em;
      }

      .speaker-grid {
        margin-top: 12px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .speaker {
        display: grid;
        grid-template-columns: 56px 1fr;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: inherit;
        padding: 10px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(70, 203, 236, 0.08);
        transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
      }
      .speaker:hover {
        transform: translateY(-1px);
        border-color: rgba(139, 92, 246, 0.35);
        background: rgba(139, 92, 246, 0.1);
      }

      .avatar {
        width: 56px;
        height: 56px;
        border-radius: 18px;
        object-fit: cover;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: #fff;
      }

      .speaker__name {
        font-weight: 900;
        letter-spacing: -0.01em;
      }
      .speaker__title {
        margin-top: 2px;
        color: rgba(55, 65, 81, 0.75);
        font-weight: 650;
        font-size: 13px;
      }

      .empty {
        margin-top: 10px;
        padding: 12px;
        border-radius: 16px;
        border: 1px dashed rgba(55, 65, 81, 0.18);
        color: rgba(55, 65, 81, 0.75);
        background: rgba(253, 242, 248, 0.55);
      }

      .not-found {
        margin-top: 18px;
        padding: 18px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }
      .muted {
        margin-top: 8px;
        color: rgba(55, 65, 81, 0.75);
        line-height: 1.6;
      }
      .button {
        margin-top: 12px;
        display: inline-flex;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 999px;
        background: var(--tc-gradient);
        border: 1px solid rgba(55, 65, 81, 0.12);
        color: rgba(55, 65, 81, 0.95);
        font-weight: 850;
      }

      @media (max-width: 720px) {
        .speaker-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SessionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(ConferenceDataService);

  private readonly sessionId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  readonly session = computed(() => this.data.getSessionById(this.sessionId()));
  readonly speakers = computed(() => {
    const s = this.session();
    if (!s) return [];
    return s.speakerIds
      .map((id) => this.data.getSpeakerById(id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x));
  });

  dayLabel(day: 'day-1' | 'day-2'): string {
    return day === 'day-1' ? 'Day 1' : 'Day 2';
  }

  trackLabel(track: string): string {
    switch (track) {
      case 'frontend':
        return 'Frontend';
      case 'backend':
        return 'Backend';
      case 'ai':
        return 'AI';
      case 'devops':
        return 'DevOps';
      case 'product':
        return 'Product';
      default:
        return track;
    }
  }
}
