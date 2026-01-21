import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Speaker } from '../../core/models/conference.models';
import { ConferenceDataService } from '../../core/services/conference-data.service';

@Component({
  selector: 'app-speakers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1 class="h1">Speakers</h1>
          <p class="lead">
            Meet the humans behind the talks. Click a card for bio + sessions.
          </p>
        </div>

        <div class="search">
          <label class="sr-only" for="speakerSearch">Search speakers</label>
          <input
            id="speakerSearch"
            class="input"
            type="search"
            [(ngModel)]="query"
            aria-label="Search speakers"
            placeholder="Search by name, company, or tag…"
          />
        </div>
      </header>

      <div class="grid" role="list" aria-label="Speaker list">
        <a
          class="card"
          role="listitem"
          *ngFor="let s of filteredSpeakers()"
          [routerLink]="['/speakers', s.id]"
          [attr.aria-label]="'Open speaker ' + s.name"
        >
          <div class="card__top">
            <img class="avatar" [src]="s.photoUrl" [alt]="s.name" loading="lazy" />
            <div class="card__meta">
              <div class="name">{{ s.name }}</div>
              <div class="title">{{ s.title }}</div>
              <div class="company">{{ s.company }}</div>
            </div>
          </div>

          <div class="tags" aria-label="Speaker tags">
            <span class="tag" *ngFor="let t of s.tags">{{ t }}</span>
          </div>

          <div class="cta">
            <span class="cta__text">View profile</span>
            <span aria-hidden="true">→</span>
          </div>
        </a>
      </div>

      <div class="empty" *ngIf="filteredSpeakers().length === 0">
        No speakers match your search. Try a different keyword.
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

      .page__header {
        display: grid;
        grid-template-columns: 1fr minmax(240px, 340px);
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
        max-width: 70ch;
      }

      .search {
        display: flex;
        justify-content: flex-end;
      }

      .input {
        width: 100%;
        padding: 12px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.8);
        box-shadow: var(--tc-shadow-sm);
        outline: none;
        font-weight: 650;
      }

      .input:focus {
        border-color: rgba(70, 203, 236, 0.55);
        box-shadow: 0 0 0 4px rgba(70, 203, 236, 0.18);
      }

      .grid {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .card {
        display: grid;
        gap: 10px;
        text-decoration: none;
        color: inherit;
        padding: 14px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.16), rgba(139, 92, 246, 0.10));
        box-shadow: var(--tc-shadow-sm);
        transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
      }

      .card:hover {
        transform: translateY(-2px);
        border-color: rgba(139, 92, 246, 0.35);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.2), rgba(139, 92, 246, 0.14));
      }

      .card__top {
        display: grid;
        grid-template-columns: 64px 1fr;
        gap: 12px;
        align-items: center;
      }

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 20px;
        object-fit: cover;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: #fff;
      }

      .name {
        font-weight: 900;
        letter-spacing: -0.01em;
      }

      .title {
        margin-top: 2px;
        font-weight: 750;
        color: rgba(55, 65, 81, 0.8);
        font-size: 13px;
      }

      .company {
        margin-top: 2px;
        color: rgba(55, 65, 81, 0.7);
        font-weight: 650;
        font-size: 13px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tag {
        display: inline-flex;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.85);
        font-weight: 650;
        font-size: 12px;
      }

      .cta {
        margin-top: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        border-top: 1px solid rgba(55, 65, 81, 0.1);
        color: rgba(55, 65, 81, 0.9);
      }

      .cta__text {
        font-weight: 850;
      }

      .empty {
        margin-top: 14px;
        padding: 12px;
        border-radius: 16px;
        border: 1px dashed rgba(55, 65, 81, 0.18);
        color: rgba(55, 65, 81, 0.75);
        background: rgba(253, 242, 248, 0.55);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      @media (max-width: 980px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 720px) {
        .page__header {
          grid-template-columns: 1fr;
        }
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SpeakersComponent {
  private readonly data = inject(ConferenceDataService);

  protected query = '';
  private readonly speakers = signal<Speaker[]>([]);

  constructor() {
    this.data.getSpeakers().subscribe((s) => this.speakers.set(s));
  }

  readonly filteredSpeakers = computed(() => {
    const q = this.query.trim().toLowerCase();
    const list = this.speakers();

    if (!q) return list;

    return list.filter((s) => {
      const hay = `${s.name} ${s.company} ${s.title} ${s.tags.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  });
}
