import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page">
      <h1>Schedule</h1>
      <p>The session schedule will appear here.</p>
    </section>
  `,
})
export class ScheduleComponent {}
