import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { SpeakersService } from '../../services/speakers.service';
import { SpeakerCardComponent } from '../../shared/speakers/speaker-card.component';

@Component({
  selector: 'app-speakers-page',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, SpeakerCardComponent],
  template: `
    <section class="page">
      <div class="container">
        <h1 class="page__title">Speakers</h1>
        <p class="page__subtitle">Meet the builders, mentors, and makers bringing fresh ideas to the stage.</p>

        <div class="grid cols-2" *ngIf="speakers$ | async as speakers; else loading">
          <app-speaker-card *ngFor="let sp of speakers" [speaker]="sp" />
        </div>

        <ng-template #loading>
          <div class="alert">Loading speakers…</div>
        </ng-template>
      </div>
    </section>
  `,
})
export class SpeakersPage {
  private speakersService = inject(SpeakersService);
  speakers$ = this.speakersService.getSpeakers();
}
