import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { VenueInfo } from '../../core/models/conference.models';
import { ConferenceDataService } from '../../core/services/conference-data.service';

@Component({
  selector: 'app-venue',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <header class="hero">
        <div class="hero__badge">Venue</div>
        <h1 class="hero__title">{{ venue().name }}</h1>
        <p class="hero__subtitle">
          Everything you need to arrive relaxed, caffeinated, and ready to learn.
        </p>
      </header>

      <div class="grid" *ngIf="venue() as v">
        <div class="card">
          <h2 class="h2">Location</h2>
          <div class="address">
            <div *ngFor="let line of v.addressLines">{{ line }}</div>
            <div>{{ v.cityRegion }}</div>
          </div>

          <div class="map" role="img" aria-label="Map placeholder">
            <div class="map__inner">
              <div class="map__title">Map placeholder</div>
              <div class="map__hint">{{ v.mapHint }}</div>
              <div class="map__pins" aria-hidden="true">
                <span class="pin pin--a"></span>
                <span class="pin pin--b"></span>
                <span class="pin pin--c"></span>
              </div>
            </div>
          </div>

          <div class="contact">
            <div class="contact__item">
              <div class="label">Email</div>
              <a class="link" [href]="'mailto:' + v.contact.email" aria-label="Email conference support">
                {{ v.contact.email }}
              </a>
            </div>
            <div class="contact__item">
              <div class="label">Phone</div>
              <a class="link" [href]="'tel:' + v.contact.phone" aria-label="Call conference support">
                {{ v.contact.phone }}
              </a>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="h2">Travel tips</h2>
          <div class="tips">
            <div class="tip" *ngFor="let t of v.travelTips">
              <div class="tip__title">{{ t.title }}</div>
              <div class="tip__details">{{ t.details }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="h2">Accessibility</h2>
          <p class="muted">
            We want everyone to feel welcome. If you need additional accommodations, contact us.
          </p>

          <ul class="list" aria-label="Accessibility features">
            <li *ngFor="let a of v.accessibility">{{ a }}</li>
          </ul>

          <div class="note" aria-label="Accessibility note">
            <span class="spark" aria-hidden="true">✦</span>
            <span>Looking for a quiet space? Ask at Registration.</span>
          </div>
        </div>
      </div>
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
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-gradient-strong);
        box-shadow: var(--tc-shadow-sm);
      }

      .hero__badge {
        display: inline-flex;
        width: fit-content;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 850;
      }

      .hero__title {
        margin-top: 12px;
        font-size: clamp(28px, 3.8vw, 44px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: rgba(55, 65, 81, 0.98);
      }

      .hero__subtitle {
        margin-top: 10px;
        line-height: 1.7;
        color: rgba(55, 65, 81, 0.85);
        max-width: 70ch;
      }

      .grid {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 12px;
        align-items: start;
      }

      .card {
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .card:nth-child(3) {
        grid-column: 1 / -1;
      }

      .h2 {
        font-size: 18px;
        letter-spacing: -0.01em;
      }

      .address {
        margin-top: 10px;
        color: rgba(55, 65, 81, 0.85);
        line-height: 1.6;
        font-weight: 650;
      }

      .map {
        margin-top: 12px;
        border-radius: 18px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.12), rgba(139, 92, 246, 0.1));
        overflow: hidden;
      }

      .map__inner {
        padding: 16px;
        min-height: 180px;
        position: relative;
      }

      .map__title {
        font-weight: 950;
        letter-spacing: -0.01em;
      }

      .map__hint {
        margin-top: 6px;
        color: rgba(55, 65, 81, 0.75);
        line-height: 1.6;
        max-width: 70ch;
      }

      .map__pins {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .pin {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.95);
        background: rgba(239, 68, 68, 0.9);
        box-shadow: 0 10px 22px rgba(55, 65, 81, 0.18);
      }
      .pin--a {
        left: 58%;
        top: 46%;
      }
      .pin--b {
        left: 38%;
        top: 62%;
        background: rgba(70, 203, 236, 0.95);
      }
      .pin--c {
        left: 72%;
        top: 30%;
        background: rgba(139, 92, 246, 0.95);
      }

      .contact {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .contact__item {
        padding: 10px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(253, 242, 248, 0.55);
      }

      .label {
        font-size: 12px;
        font-weight: 850;
        color: rgba(55, 65, 81, 0.7);
      }

      .link {
        display: inline-flex;
        margin-top: 6px;
        text-decoration: none;
        font-weight: 850;
        color: rgba(55, 65, 81, 0.9);
      }
      .link:hover {
        color: rgba(139, 92, 246, 0.9);
      }

      .tips {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .tip {
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.08), rgba(139, 92, 246, 0.06));
      }

      .tip__title {
        font-weight: 950;
        letter-spacing: -0.01em;
      }

      .tip__details {
        margin-top: 6px;
        line-height: 1.6;
        color: rgba(55, 65, 81, 0.82);
      }

      .muted {
        margin-top: 8px;
        line-height: 1.6;
        color: rgba(55, 65, 81, 0.78);
      }

      .list {
        margin-top: 10px;
        padding-left: 18px;
        line-height: 1.7;
        color: rgba(55, 65, 81, 0.85);
      }

      .note {
        margin-top: 12px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
      }
      .spark {
        width: 28px;
        height: 28px;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--tc-gradient);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 900;
      }

      @media (max-width: 980px) {
        .grid {
          grid-template-columns: 1fr;
        }
        .card:nth-child(3) {
          grid-column: auto;
        }
      }
    `,
  ],
})
export class VenueComponent {
  private readonly data = inject(ConferenceDataService);

  protected readonly venue = signal<VenueInfo>({
    name: 'Loading…',
    addressLines: [],
    cityRegion: '',
    mapHint: '',
    travelTips: [],
    accessibility: [],
    contact: { email: '', phone: '' },
  });

  constructor() {
    this.data.getVenueInfo().subscribe((v) => this.venue.set(v));
  }
}
