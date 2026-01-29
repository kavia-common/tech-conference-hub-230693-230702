import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgFor, SlicePipe } from '@angular/common';
import { SpeakersService } from '../../services/speakers.service';
import { SessionsService } from '../../services/sessions.service';
import { SpeakerCardComponent } from '../../shared/speakers/speaker-card.component';
import { SessionListComponent } from '../../shared/sessions/session-list.component';
import { ButtonComponent } from '../../shared/ui/button.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgFor, SlicePipe, SpeakerCardComponent, SessionListComponent, ButtonComponent],
  template: `
    <section class="page">
      <div class="container">
        <div class="hero surface">
          <div class="hero__copy">
            <div class="kicker">May 14 · Main Hall + Breakout Rooms · Live & vibrant</div>
            <h1 class="page__title">Tech Conference Hub</h1>
            <p class="page__subtitle">
              Explore speakers, build your schedule, and grab tickets for a joyful day of modern engineering.
            </p>

            <div class="hero__actions">
              <a routerLink="/tickets"><app-button variant="primary">Get tickets</app-button></a>
              <a routerLink="/schedule"><app-button variant="secondary">Browse schedule</app-button></a>
            </div>
          </div>

          <div class="hero__stats" aria-label="Event highlights">
            <div class="stat">
              <div class="stat__num">1</div>
              <div class="stat__label">Day</div>
            </div>
            <div class="stat">
              <div class="stat__num">5</div>
              <div class="stat__label">Tracks</div>
            </div>
            <div class="stat">
              <div class="stat__num">10+</div>
              <div class="stat__label">Sessions</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2 class="section__title">Featured speakers</h2>
          <div class="grid cols-2">
            <app-speaker-card *ngFor="let sp of (speakers$ | async) | slice:0:2" [speaker]="sp" />
          </div>
          <div class="section__cta">
            <a routerLink="/speakers"><app-button variant="ghost">Meet all speakers</app-button></a>
          </div>
        </div>

        <div class="section">
          <h2 class="section__title">What’s on</h2>
          <app-session-list [sessions]="(sessions$ | async) | slice:0:3" />
          <div class="section__cta">
            <a routerLink="/schedule"><app-button variant="ghost">See full schedule</app-button></a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 18px;
      border-radius: var(--radius-lg);
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 16px;
      background:
        radial-gradient(1000px 400px at 20% 20%, rgba(70,203,236,0.16), transparent 60%),
        radial-gradient(1000px 400px at 80% 0%, rgba(139,92,246,0.16), transparent 60%),
        rgba(255,255,255,0.78);
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }

    .hero__stats {
      display: grid;
      gap: 10px;
      align-content: start;
    }

    .stat {
      border-radius: var(--radius-lg);
      border: 1px solid rgba(55,65,81,0.10);
      background: rgba(255,255,255,0.72);
      padding: 14px;
      box-shadow: var(--shadow-sm);
    }

    .stat__num {
      font-size: 1.8rem;
      font-weight: 950;
      letter-spacing: -0.03em;
      background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .stat__label {
      opacity: 0.9;
      font-weight: 700;
      margin-top: 6px;
    }

    .section {
      margin-top: 22px;
    }

    .section__title {
      font-size: 1.25rem;
      font-weight: 950;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }

    .section__cta {
      margin-top: 12px;
      display: flex;
      justify-content: flex-start;
    }

    @media (max-width: 980px) {
      .hero {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class HomePage {
  private speakersService = inject(SpeakersService);
  private sessionsService = inject(SessionsService);

  speakers$ = this.speakersService.getSpeakers();
  sessions$ = this.sessionsService.getSessions();
}
