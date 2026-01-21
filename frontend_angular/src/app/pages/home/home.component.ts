import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config';
import { Session, Speaker } from '../../core/models/conference.models';
import { ConferenceDataService } from '../../core/services/conference-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">
      <header class="hero" aria-label="Conference highlight">
        <div class="hero__badge">Tech Conference Hub</div>
        <h1 class="hero__title">A joyful, vibrant tech conference — built to explore.</h1>
        <p class="hero__subtitle">
          Browse speakers, plan your schedule, and grab tickets. Everything is SSR-friendly and ready
          to connect to real services.
        </p>

        <div class="hero__actions" aria-label="Primary actions">
          <a class="button button--primary" routerLink="/tickets" aria-label="Go to tickets page">
            Get Tickets
          </a>
          <a class="button button--ghost" routerLink="/schedule" aria-label="View schedule">
            View Schedule
          </a>
        </div>

        <div class="hero__stats" role="list" aria-label="Conference summary">
          <div class="stat" role="listitem">
            <div class="stat__label">Speakers</div>
            <div class="stat__value">{{ speakerCount() }}</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat__label">Sessions</div>
            <div class="stat__value">{{ sessionCount() }}</div>
          </div>
          <div class="stat" role="listitem">
            <div class="stat__label">Days</div>
            <div class="stat__value">{{ dayCount() }}</div>
          </div>
        </div>
      </header>

      <div class="sections">
        <a class="tile" routerLink="/speakers" aria-label="Explore speakers">
          <div class="tile__icon" aria-hidden="true">🎤</div>
          <div class="tile__content">
            <div class="tile__title">Speakers</div>
            <div class="tile__desc">Card grid with bios + session links.</div>
          </div>
          <div class="tile__chev" aria-hidden="true">→</div>
        </a>

        <a class="tile" routerLink="/schedule" aria-label="Explore schedule">
          <div class="tile__icon" aria-hidden="true">🗓️</div>
          <div class="tile__content">
            <div class="tile__title">Schedule</div>
            <div class="tile__desc">Filter by day/track and open session details.</div>
          </div>
          <div class="tile__chev" aria-hidden="true">→</div>
        </a>

        <a class="tile" routerLink="/venue" aria-label="Explore venue">
          <div class="tile__icon" aria-hidden="true">📍</div>
          <div class="tile__content">
            <div class="tile__title">Venue</div>
            <div class="tile__desc">Location info, travel tips, accessibility.</div>
          </div>
          <div class="tile__chev" aria-hidden="true">→</div>
        </a>
      </div>

      <section class="highlight" aria-label="Quick highlight">
        <div class="highlight__card" *ngIf="featuredSession() as fs">
          <div class="highlight__title">Featured session</div>
          <div class="highlight__name">{{ fs.title }}</div>
          <div class="highlight__meta">
            <span class="pill">{{ featuredDayLabel(fs.day) }}</span>
            <span class="pill pill--soft">
              {{ fs.startTime }}–{{ fs.endTime }}
            </span>
            <span class="pill pill--soft">{{ fs.room }}</span>
          </div>
          <p class="highlight__desc">{{ fs.abstract }}</p>

          <a class="button button--small" [routerLink]="['/schedule', fs.id]" aria-label="Open featured session details">
            View session details
          </a>
        </div>

        <div class="meta-card" *ngIf="config">
          <div class="meta-card__label">Environment</div>
          <div class="meta-card__value">{{ config.nodeEnv ?? 'unknown' }}</div>

          <div class="meta-card__label meta-card__label--spaced">API Base</div>
          <div class="meta-card__value">{{ config.apiBase ?? 'not set' }}</div>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 28px 16px 10px;
      }

      .hero {
        padding: 18px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-gradient-strong);
        box-shadow: var(--tc-shadow-sm);
      }

      .hero__badge {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 850;
        width: fit-content;
      }

      .hero__title {
        margin-top: 14px;
        font-size: clamp(30px, 4vw, 52px);
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: rgba(55, 65, 81, 0.98);
      }

      .hero__subtitle {
        margin-top: 10px;
        font-size: 16px;
        line-height: 1.7;
        color: rgba(55, 65, 81, 0.85);
        max-width: 75ch;
      }

      .hero__actions {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        padding: 12px 14px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 950;
        color: rgba(55, 65, 81, 0.95);
        box-shadow: var(--tc-shadow-sm);
      }

      .button--primary {
        background: var(--tc-gradient);
      }

      .button--ghost {
        background: rgba(255, 255, 255, 0.72);
      }

      .button--small {
        padding: 10px 12px;
        background: var(--tc-gradient);
      }

      .hero__stats {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .stat {
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.72);
      }

      .stat__label {
        font-size: 12px;
        font-weight: 850;
        color: rgba(55, 65, 81, 0.7);
      }

      .stat__value {
        margin-top: 6px;
        font-size: 22px;
        font-weight: 1000;
        letter-spacing: -0.02em;
      }

      .sections {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .tile {
        display: grid;
        grid-template-columns: 44px 1fr 26px;
        align-items: center;
        gap: 12px;
        padding: 14px;
        text-decoration: none;
        color: inherit;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.12), rgba(139, 92, 246, 0.08));
        box-shadow: var(--tc-shadow-sm);
        transition: transform 140ms ease, border-color 140ms ease;
      }

      .tile:hover {
        transform: translateY(-2px);
        border-color: rgba(70, 203, 236, 0.45);
      }

      .tile__icon {
        width: 44px;
        height: 44px;
        border-radius: 16px;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-size: 18px;
      }

      .tile__title {
        font-weight: 950;
        letter-spacing: -0.01em;
      }

      .tile__desc {
        margin-top: 4px;
        color: rgba(55, 65, 81, 0.78);
        line-height: 1.55;
        font-weight: 650;
      }

      .tile__chev {
        font-weight: 900;
        color: rgba(55, 65, 81, 0.75);
      }

      .highlight {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 12px;
        align-items: start;
      }

      .highlight__card {
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .highlight__title {
        font-size: 12px;
        font-weight: 900;
        color: rgba(55, 65, 81, 0.7);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .highlight__name {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 1000;
        letter-spacing: -0.02em;
      }

      .highlight__meta {
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
        background: rgba(139, 92, 246, 0.16);
        border: 1px solid rgba(139, 92, 246, 0.35);
        font-size: 12px;
        font-weight: 750;
      }

      .pill--soft {
        background: rgba(253, 242, 248, 0.65);
        border-color: rgba(55, 65, 81, 0.12);
        color: rgba(55, 65, 81, 0.85);
        font-weight: 650;
      }

      .highlight__desc {
        margin-top: 10px;
        line-height: 1.7;
        color: rgba(55, 65, 81, 0.85);
        max-width: 80ch;
      }

      .meta-card {
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
        box-shadow: var(--tc-shadow-sm);
      }

      .meta-card__label {
        font-size: 12px;
        color: rgba(55, 65, 81, 0.65);
        font-weight: 800;
      }

      .meta-card__label--spaced {
        margin-top: 12px;
      }

      .meta-card__value {
        margin-top: 6px;
        font-weight: 800;
        color: var(--tc-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 980px) {
        .sections {
          grid-template-columns: 1fr;
        }
        .highlight {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .hero__stats {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private readonly data = inject(ConferenceDataService);

  readonly config: AppConfig = inject(APP_CONFIG);

  protected readonly speakers = signal<Speaker[]>([]);
  protected readonly sessions = signal<Session[]>([]);

  constructor() {
    // Subscribe once; HttpClient completes after one emission; SSR-safe.
    this.data.getSpeakers().subscribe((s) => this.speakers.set(s));
    this.data.getSessions().subscribe((s) => this.sessions.set(s));
  }

  readonly speakerCount = computed(() => this.speakers().length);
  readonly sessionCount = computed(() => this.sessions().length);
  readonly dayCount = computed(() => this.data.getDays().length);

  readonly featuredSession = computed(() => this.sessions()[0] ?? null);

  featuredDayLabel(day: string): string {
    return day === 'day-1' ? 'Day 1' : 'Day 2';
  }
}
