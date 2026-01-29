import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-venue-page',
  standalone: true,
  imports: [NgFor, CardComponent, BadgeComponent],
  styles: [`
    .map {
      border-radius: var(--radius-lg);
      border: 1px dashed rgba(55, 65, 81, 0.24);
      padding: 16px;
      background:
        radial-gradient(700px 250px at 20% 20%, rgba(70,203,236,0.12), transparent 60%),
        radial-gradient(700px 250px at 90% 0%, rgba(139,92,246,0.12), transparent 60%),
        rgba(255,255,255,0.75);
    }

    .faqQ {
      font-weight: 900;
      margin-bottom: 6px;
    }

    .faqA {
      opacity: 0.92;
      line-height: 1.55;
    }
  `],
  template: `
    <section class="page">
      <div class="container">
        <h1 class="page__title">Venue</h1>
        <p class="page__subtitle">Everything you need to arrive prepared—location, transit tips, and FAQs.</p>

        <div class="grid cols-2">
          <div class="surface" style="padding: 18px;">
            <h2 class="section__title">Location</h2>
            <div class="card__meta">
              <app-badge variant="primary">Main Hall</app-badge>
              <app-badge variant="secondary">Breakout Rooms A–C</app-badge>
            </div>
            <div class="hr"></div>
            <div class="muted" style="line-height: 1.6;">
              <strong>Tech Conference Center</strong><br />
              123 Innovation Ave<br />
              San Francisco, CA (example address)
            </div>

            <div class="hr"></div>

            <h3 class="card__title">Transit tips</h3>
            <ul style="padding-left: 18px; line-height: 1.6; opacity: 0.95;">
              <li>Arrive early for badge pickup.</li>
              <li>Bike racks available on the north entrance.</li>
              <li>Accessible entry via the east ramp.</li>
            </ul>
          </div>

          <div class="map" aria-label="Map placeholder">
            <h2 class="section__title">Map</h2>
            <p class="muted" style="line-height: 1.6;">
              Map integration is intentionally mocked in this build.
              Replace this panel with your preferred map provider once a backend/integration is available.
            </p>

            <div class="hr"></div>

            <div class="grid">
              <app-card ariaLabel="Room locations">
                <div class="card__title">Rooms</div>
                <div class="muted">Main Hall (Keynote), Room A (Frontend/AI), Room B (Cloud), Room C (Backend)</div>
              </app-card>
              <app-card ariaLabel="Food and accessibility info">
                <div class="card__title">Food & accessibility</div>
                <div class="muted">Coffee bar near lobby · Quiet room available · All stages have captions</div>
              </app-card>
            </div>
          </div>
        </div>

        <div class="hr"></div>

        <h2 class="section__title">FAQ</h2>
        <div class="grid cols-2">
          <app-card *ngFor="let item of faq" [ariaLabel]="item.q">
            <div class="faqQ">{{ item.q }}</div>
            <div class="faqA">{{ item.a }}</div>
          </app-card>
        </div>
      </div>
    </section>
  `,
})
export class VenuePage {
  faq = [
    {
      q: 'Do I need to print my ticket?',
      a: 'No—show your confirmation ID on your phone. This app uses mocked tickets, but the UX matches a real flow.',
    },
    {
      q: 'Will sessions be recorded?',
      a: 'Yes. Recordings are included with both ticket types (mocked policy).',
    },
    {
      q: 'Is the venue accessible?',
      a: 'Yes. Accessible entrances and seating areas are available. Ask volunteers for help.',
    },
    {
      q: 'Can I switch sessions?',
      a: 'Absolutely. You can attend any session; use the schedule pages to explore details.',
    },
  ];
}
