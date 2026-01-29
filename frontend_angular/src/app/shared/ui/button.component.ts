import { Component, Input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      class="btn"
      [class.btn--primary]="variant === 'primary'"
      [class.btn--secondary]="variant === 'secondary'"
      [class.btn--ghost]="variant === 'ghost'"
      [attr.aria-label]="ariaLabel || null"
      [disabled]="disabled"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() ariaLabel: string | null = null;
  @Input() disabled = false;
}
