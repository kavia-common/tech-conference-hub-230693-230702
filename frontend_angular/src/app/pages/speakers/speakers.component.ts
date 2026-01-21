import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-speakers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Speakers</h1>
      <p>Speaker profiles will appear here.</p>
    </section>
  `,
})
export class SpeakersComponent {}
