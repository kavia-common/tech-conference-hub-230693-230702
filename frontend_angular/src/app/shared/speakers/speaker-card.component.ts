import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Speaker } from '../../models/conference.models';
import { BadgeComponent } from '../ui/badge.component';
import { CardComponent } from '../ui/card.component';

@Component({
  selector: 'app-speaker-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent, CardComponent],
  styles: [`
    .head {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      flex: 0 0 auto;
      box-shadow: 0 10px 26px rgba(55, 65, 81, 0.14);
    }

    .name {
      font-weight: 900;
      letter-spacing: -0.01em;
      font-size: 1.08rem;
    }

    .sub {
      opacity: 0.9;
      margin-top: 2px;
      line-height: 1.3;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    a.more {
      display: inline-flex;
      margin-top: 12px;
      font-weight: 800;
      color: rgba(55, 65, 81, 0.95);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 3px;
    }
  `],
  template: `
    <app-card [ariaLabel]="'Speaker ' + speaker.name">
      <div class="head">
        <div class="avatar" [style.background]="speaker.avatarBg" aria-hidden="true"></div>
        <div>
          <div class="name">{{ speaker.name }}</div>
          <div class="sub">{{ speaker.title }} · {{ speaker.company }}</div>
        </div>
      </div>

      <div class="tags" aria-label="Speaker tracks">
        <app-badge *ngFor="let t of speaker.tags; let i = index" [variant]="i % 2 === 0 ? 'primary' : 'secondary'">
          {{ t }}
        </app-badge>
      </div>

      <a class="more" [routerLink]="['/speakers', speaker.id]">View profile</a>
    </app-card>
  `,
})
export class SpeakerCardComponent {
  @Input({ required: true }) speaker!: Speaker;
}
