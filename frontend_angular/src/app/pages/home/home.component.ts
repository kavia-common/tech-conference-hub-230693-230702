import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero__badge">Tech Conference Hub</div>
      <h1 class="hero__title">Welcome to the most joyful tech event of the year</h1>
      <p class="hero__subtitle">
        Explore speakers, browse the schedule, and grab your tickets. Built with a playful, vibrant theme.
      </p>

      <div class="hero__meta" *ngIf="config">
        <div class="meta-card">
          <div class="meta-card__label">Environment</div>
          <div class="meta-card__value">{{ config.nodeEnv ?? 'unknown' }}</div>
        </div>
        <div class="meta-card" *ngIf="config.apiBase">
          <div class="meta-card__label">API Base</div>
          <div class="meta-card__value">{{ config.apiBase }}</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero{
      padding: 28px 16px 10px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .hero__badge{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(70,203,236,0.25), rgba(139,92,246,0.25));
      border: 1px solid rgba(55,65,81,0.12);
      color: var(--tc-text);
      font-weight: 650;
      letter-spacing: 0.2px;
      width: fit-content;
    }
    .hero__title{
      margin-top: 14px;
      font-size: clamp(30px, 4vw, 44px);
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--tc-text);
    }
    .hero__subtitle{
      margin-top: 10px;
      font-size: 16px;
      line-height: 1.6;
      color: rgba(55,65,81,0.85);
      max-width: 64ch;
    }
    .hero__meta{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-top: 18px;
    }
    .meta-card{
      background: var(--tc-surface);
      border-radius: var(--tc-radius-lg);
      border: 1px solid rgba(55,65,81,0.10);
      padding: 12px 14px;
      box-shadow: var(--tc-shadow-sm);
    }
    .meta-card__label{
      font-size: 12px;
      color: rgba(55,65,81,0.65);
    }
    .meta-card__value{
      margin-top: 4px;
      font-weight: 650;
      color: var(--tc-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class HomeComponent {
  readonly config: AppConfig = inject(APP_CONFIG);
}
