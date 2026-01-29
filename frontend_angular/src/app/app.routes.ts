import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { SpeakersPage } from './pages/speakers/speakers.page';
import { SpeakerDetailPage } from './pages/speakers/speaker-detail.page';
import { SchedulePage } from './pages/schedule/schedule.page';
import { SessionDetailPage } from './pages/schedule/session-detail.page';
import { TicketsPage } from './pages/tickets/tickets.page';
import { TicketsConfirmationPage } from './pages/tickets/tickets-confirmation.page';
import { VenuePage } from './pages/venue/venue.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePage },
  { path: 'speakers', component: SpeakersPage },
  { path: 'speakers/:id', component: SpeakerDetailPage },

  { path: 'schedule', component: SchedulePage },
  { path: 'schedule/:id', component: SessionDetailPage },

  { path: 'tickets', component: TicketsPage },
  { path: 'tickets/confirmation', component: TicketsConfirmationPage },

  { path: 'venue', component: VenuePage },

  { path: '**', component: NotFoundPage },
];
