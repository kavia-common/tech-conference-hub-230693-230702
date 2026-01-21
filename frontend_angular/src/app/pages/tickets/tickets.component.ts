import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Tickets</h1>
      <p>Ticket purchase flow will appear here.</p>
    </section>
  `,
})
export class TicketsComponent {}
