import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venue',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Venue</h1>
      <p>Venue details and map will appear here.</p>
    </section>
  `,
})
export class VenueComponent {}
