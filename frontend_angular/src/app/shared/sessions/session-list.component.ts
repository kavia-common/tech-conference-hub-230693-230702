import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Session } from '../../models/conference.models';
import { BadgeComponent } from '../ui/badge.component';
import { CardComponent } from '../ui/card.component';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe, BadgeComponent, CardComponent],
  styles: [`
    .itemTitle {
      font-weight: 900;
      letter-spacing: -0.01em;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: baseline;
      justify-content: space-between;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
      align-items: center;
    }

    .time {
      font-weight: 800;
      opacity: 0.9;
    }

    .desc {
      margin-top: 8px;
      line-height: 1.55;
      opacity: 0.92;
    }

    a.detail {
      display: inline-flex;
      margin-top: 12px;
      font-weight: 850;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
  `],
  template: `
    <div class="grid" *ngIf="sessions?.length; else empty">
      <app-card *ngFor="let s of sessions" [ariaLabel]="'Session ' + s.title">
        <div class="itemTitle">
          <span>{{ s.title }}</span>
          <span class="badge badge--secondary">{{ s.room }}</span>
        </div>

        <div class="meta">
          <span class="time">{{ s.startsAtIso | date:'EEE, MMM d · HH:mm':'UTC' }} (UTC)</span>
          <app-badge variant="primary">{{ s.track }}</app-badge>
          <app-badge variant="secondary">{{ s.level }}</app-badge>
          <span class="badge" *ngFor="let t of s.tags">{{ t }}</span>
        </div>

        <p class="desc">{{ s.description }}</p>

        <a class="detail" [routerLink]="['/schedule', s.id]">View session details</a>
      </app-card>
    </div>

    <ng-template #empty>
      <div class="alert">No sessions to show.</div>
    </ng-template>
  `,
})
export class SessionListComponent {
  @Input() sessions: Session[] | null = null;
}
