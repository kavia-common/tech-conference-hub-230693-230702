import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Tech Conference Hub'
  },
  {
    path: 'speakers',
    loadComponent: () =>
      import('./pages/speakers/speakers.component').then((m) => m.SpeakersComponent),
    title: 'Speakers'
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./pages/schedule/schedule.component').then((m) => m.ScheduleComponent),
    title: 'Schedule'
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./pages/tickets/tickets.component').then((m) => m.TicketsComponent),
    title: 'Tickets'
  },
  {
    path: 'venue',
    loadComponent: () =>
      import('./pages/venue/venue.component').then((m) => m.VenueComponent),
    title: 'Venue'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
