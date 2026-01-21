import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Session, Speaker } from '../../core/models/conference.models';
import { ConferenceDataService } from '../../core/services/conference-data.service';

@Component({
  selector: 'app-speaker-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <a class="back" routerLink="/speakers" aria-label="Back to speakers">← Back to Speakers</a>

      <div class="hero" *ngIf="speaker(); else notFound">
        <div class="hero__card">
          <img class="avatar" [src]="speaker()!.photoUrl" [alt]="speaker()!.name" loading="lazy" />
          <div class="hero__meta">
            <h1 class="title">{{ speaker()!.name }}</h1>
            <div class="subtitle">{{ speaker()!.title }} • {{ speaker()!.company }}</div>

            <div class="tags" role="list" aria-label="Speaker tags">
              <span class="tag" role="listitem" *ngFor="let t of speaker()!.tags">{{ t }}</span>
            </div>

            <p class="bio">{{ speaker()!.bio }}</p>

            <div class="social" *ngIf="speaker()!.socials?.length">
              <a
                class="link"
                *ngFor="let s of speaker()!.socials"
                [href]="s.url"
                target="_blank"
                rel="noreferrer"
                [attr.aria-label]="'Open ' + s.label + ' for ' + speaker()!.name"
              >
                {{ s.label }} ↗
              </a>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="h2">Sessions</h2>

          <div class="session-list" *ngIf="sessions().length; else noneSessions">
            <a
              class="session"
              *ngFor="let s of sessions()"
              [routerLink]="['/schedule', s.id]"
              [attr.aria-label]="'Open session ' + s.title"
            >
              <div class="session__top">
                <div class="session__title">{{ s.title }}</div>
                <span class="pill">{{ dayLabel(s.day) }}</span>
              </div>
              <div class="session__meta">
                <span class="pill pill--soft">{{ s.startTime }}–{{ s.endTime }}</span>
                <span class="pill pill--soft">{{ s.room }}</span>
                <span class="pill pill--soft">{{ trackLabel(s.track) }}</span>
              </div>
            </a>
          </div>

          <ng-template #noneSessions>
            <div class="empty">No sessions listed yet for this speaker.</div>
          </ng-template>
        </div>
      </div>

      <ng-template #notFound>
        <div class="not-found">
          <h1 class="title">Speaker not found</h1>
          <p class="muted">That profile doesn’t exist (yet). Try another speaker.</p>
          <a class="button" routerLink="/speakers">Browse Speakers</a>
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

      .hero {
        margin-top: 14px;
        display: grid;
        gap: 14px;
      }

      .hero__card {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 14px;
        padding: 14px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.18), rgba(139, 92, 246, 0.12));
        box-shadow: var(--tc-shadow-sm);
      }

      .avatar {
        width: 110px;
        height: 110px;
        border-radius: 26px;
        object-fit: cover;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: #fff;
      }

      .title {
        letter-spacing: -0.02em;
        line-height: 1.1;
        font-size: clamp(26px, 3.5vw, 40px);
        color: var(--tc-text);
      }
      .subtitle {
        margin-top: 6px;
        color: rgba(55, 65, 81, 0.8);
        font-weight: 650;
      }
      .tags {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tag {
        display: inline-flex;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.8);
        font-weight: 650;
        font-size: 12px;
      }
      .bio {
        margin-top: 10px;
        line-height: 1.7;
        color: rgba(55, 65, 81, 0.85);
        max-width: 75ch;
      }
      .social {
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .link {
        display: inline-flex;
        padding: 8px 10px;
        border-radius: 999px;
        background: rgba(70, 203, 236, 0.18);
        border: 1px solid rgba(70, 203, 236, 0.35);
        text-decoration: none;
        color: rgba(55, 65, 81, 0.9);
        font-weight: 700;
      }
      .link:hover {
        background: rgba(139, 92, 246, 0.16);
        border-color: rgba(139, 92, 246, 0.35);
      }

      .section {
        padding: 14px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .h2 {
        font-size: 18px;
        letter-spacing: -0.01em;
      }

      .session-list {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .session {
        display: block;
        text-decoration: none;
        color: inherit;
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(253, 242, 248, 0.55);
        transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
      }
      .session:hover {
        transform: translateY(-1px);
        border-color: rgba(70, 203, 236, 0.45);
        background: rgba(70, 203, 236, 0.1);
      }

      .session__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .session__title {
        font-weight: 850;
        letter-spacing: -0.01em;
      }
      .session__meta {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(139, 92, 246, 0.16);
        border: 1px solid rgba(139, 92, 246, 0.35);
        font-size: 12px;
        font-weight: 750;
      }
      .pill--soft {
        background: rgba(255, 255, 255, 0.8);
        border-color: rgba(55, 65, 81, 0.12);
        color: rgba(55, 65, 81, 0.85);
        font-weight: 650;
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
        .hero__card {
          grid-template-columns: 1fr;
        }
        .avatar {
          width: 92px;
          height: 92px;
          border-radius: 22px;
        }
      }
    `,
  ],
})
export class SpeakerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(ConferenceDataService);

  private readonly speakerId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  protected readonly speaker = signal<Speaker | null>(null);
  protected readonly sessions = signal<Session[]>([]);

  constructor() {
    const id = this.speakerId();
    this.data.getSpeakerById(id).subscribe((s) => this.speaker.set(s));
    this.data.getSessionsForSpeaker(id).subscribe((sessions) => this.sessions.set(sessions));
  }

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
