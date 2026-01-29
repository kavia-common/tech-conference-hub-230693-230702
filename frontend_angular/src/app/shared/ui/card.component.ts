import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <article class="card" [attr.aria-label]="ariaLabel || null">
      <ng-content />
    </article>
  `,
})
export class CardComponent {
  @Input() ariaLabel: string | null = null;
}
