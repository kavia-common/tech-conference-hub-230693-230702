import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DayId, Speaker, TrackId, Session } from '../../core/models/conference.models';
import { ConferenceDataService } from '../../core/services/conference-data.service';

type DayFilter = DayId | 'all';
type TrackFilter = TrackId | 'all';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1 class="h1">Schedule</h1>
          <p class="lead">
            Filter by day and track, then tap a session for the full abstract.
          </p>
        </div>

        <div class="filters" aria-label="Schedule filters">
          <div class="filter">
            <label class="label" for="dayFilter">Day</label>
            <select id="dayFilter" class="select" [(ngModel)]="dayFilter" aria-label="Filter by day">
              <option value="all">All days</option>
              <option *ngFor="let d of days()" [value]="d.id">{{ d.label }}</option>
            </select>
          </div>

          <div class="filter">
            <label class="label" for="trackFilter">Track</label>
            <select id="trackFilter" class="select" [(ngModel)]="trackFilter" aria-label="Filter by track">
              <option value="all">All tracks</option>
              <option *ngFor="let t of tracks()" [value]="t.id">{{ t.label }}</option>
            </select>
          </div>
        </div>
      </header>

      <div class="list" *ngIf="filteredSessions().length; else empty">
        <a
          class="session"
          *ngFor="let s of filteredSessions()"
          [routerLink]="['/schedule', s.id]"
          [attr.aria-label]="'Open session ' + s.title"
        >
          <div class="session__left">
            <div class="time">
              <span class="time__main">{{ s.startTime }}</span>
              <span class="time__sub">→ {{ s.endTime }}</span>
            </div>
          </div>

          <div class="session__body">
            <div class="title">{{ s.title }}</div>

            <div class="meta">
              <span class="pill">{{ dayLabel(s.day) }}</span>
              <span class="pill pill--soft">{{ trackLabel(s.track) }}</span>
              <span class="pill pill--soft">{{ s.room }}</span>
              <span class="pill pill--soft">{{ speakerNames(s.speakerIds) }}</span>
            </div>

            <div class="abstract">{{ s.abstract }}</div>
          </div>

          <div class="session__right" aria-hidden="true">→</div>
        </a>
      </div>

      <ng-template #empty>
        <div class="empty">
          No sessions match these filters. Try selecting “All days” or a different track.
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 28px 16px 10px;
      }

      .page__header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        align-items: end;
      }

      .h1 {
        font-size: clamp(28px, 3.8vw, 40px);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }

      .lead {
        margin-top: 10px;
        line-height: 1.6;
        color: rgba(55, 65, 81, 0.85);
        max-width: 72ch;
      }

      .filters {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .filter {
        display: grid;
        gap: 6px;
      }

      .label {
        font-size: 12px;
        font-weight: 800;
        color: rgba(55, 65, 81, 0.7);
        padding-left: 10px;
      }

      .select {
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.85);
        box-shadow: var(--tc-shadow-sm);
        outline: none;
        font-weight: 700;
        color: rgba(55, 65, 81, 0.9);
      }
      .select:focus {
        border-color: rgba(70, 203, 236, 0.55);
        box-shadow: 0 0 0 4px rgba(70, 203, 236, 0.18);
      }

      .list {
        margin-top: 14px;
        display: grid;
        gap: 10px;
      }

      .session {
        display: grid;
        grid-template-columns: 92px 1fr 26px;
        gap: 12px;
        align-items: start;
        text-decoration: none;
        color: inherit;
        padding: 14px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.12), rgba(139, 92, 246, 0.08));
        box-shadow: var(--tc-shadow-sm);
        transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
      }

      .session:hover {
        transform: translateY(-1px);
        border-color: rgba(70, 203, 236, 0.45);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.18), rgba(139, 92, 246, 0.12));
      }

      .time {
        display: grid;
        gap: 4px;
        padding: 10px;
        border-radius: 18px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
      }
      .time__main {
        font-weight: 950;
        font-size: 16px;
        letter-spacing: -0.01em;
      }
      .time__sub {
        font-weight: 750;
        font-size: 12px;
        color: rgba(55, 65, 81, 0.75);
      }

      .title {
        font-weight: 950;
        letter-spacing: -0.01em;
      }

      .meta {
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

      .abstract {
        margin-top: 10px;
        color: rgba(55, 65, 81, 0.82);
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-width: 85ch;
      }

      .session__right {
        font-size: 18px;
        font-weight: 900;
        color: rgba(55, 65, 81, 0.7);
        padding-top: 8px;
      }

      .empty {
        margin-top: 14px;
        padding: 12px;
        border-radius: 16px;
        border: 1px dashed rgba(55, 65, 81, 0.18);
        color: rgba(55, 65, 81, 0.75);
        background: rgba(253, 242, 248, 0.55);
      }

      @media (max-width: 820px) {
        .page__header {
          grid-template-columns: 1fr;
          align-items: start;
        }
        .filters {
          justify-content: flex-start;
        }
      }

      @media (max-width: 720px) {
        .session {
          grid-template-columns: 1fr;
        }
        .session__right {
          display: none;
        }
        .time {
          width: fit-content;
        }
      }
    `,
  ],
})
export class ScheduleComponent {
  private readonly data = inject(ConferenceDataService);

  protected readonly days = signal(this.data.getDays());
  protected readonly tracks = signal(this.data.getTracks());

  protected dayFilter: DayFilter = 'all';
  protected trackFilter: TrackFilter = 'all';

  private readonly sessions = signal<Session[]>([]);
  private readonly speakers = signal<Speaker[]>([]);

  constructor() {
    this.data.getSessions().subscribe((s) => this.sessions.set(s));
    this.data.getSpeakers().subscribe((s) => this.speakers.set(s));
  }

  readonly filteredSessions = computed(() => {
    const d = this.dayFilter;
    const t = this.trackFilter;

    return this.sessions()
      .filter((s) => (d === 'all' ? true : s.day === d))
      .filter((s) => (t === 'all' ? true : s.track === t))
      .slice()
      .sort((a, b) => {
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.startTime.localeCompare(b.startTime);
      });
  });

  dayLabel(day: DayId): string {
    return day === 'day-1' ? 'Day 1' : 'Day 2';
  }

  trackLabel(track: TrackId): string {
    const t = this.tracks().find((x) => x.id === track);
    return t?.label ?? track;
  }

  speakerNames(ids: string[]): string {
    const map = new Map(this.speakers().map((s) => [s.id, s.name]));
    const names = ids.map((id) => map.get(id)).filter((n): n is string => Boolean(n));
    return names.length ? names.join(', ') : 'TBA';
  }
}
