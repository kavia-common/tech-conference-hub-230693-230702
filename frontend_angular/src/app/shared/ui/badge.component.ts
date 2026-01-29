import { Component, Input } from '@angular/core';

type BadgeVariant = 'primary' | 'secondary' | 'default';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [class.badge--primary]="variant === 'primary'"
      [class.badge--secondary]="variant === 'secondary'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
}
