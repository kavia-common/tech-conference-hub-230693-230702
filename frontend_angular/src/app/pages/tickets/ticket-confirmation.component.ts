import { CommonModule } from '@angular/common';
import { Component, EventEmitter } from '@angular/core';
import { TicketOrderConfirmation } from '../../core/models/conference.models';

@Component({
  selector: 'app-ticket-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="confirm" aria-label="Mock purchase confirmation">
      <div class="card">
        <div class="badge">
          <span class="spark" aria-hidden="true">✓</span>
          <span><strong>Mock purchase complete</strong></span>
        </div>

        <h2 class="title">You’re going to Tech Conference Hub!</h2>

        <div class="meta">
          <div class="meta__row">
            <span class="label">Order</span>
            <span class="value">{{ confirmation.orderId }}</span>
          </div>
          <div class="meta__row">
            <span class="label">Email</span>
            <span class="value">{{ confirmation.email }}</span>
          </div>
          <div class="meta__row">
            <span class="label">Total</span>
            <span class="value">\${{ confirmation.totalUsd }}</span>
          </div>
        </div>

        <div class="lines">
          <div class="line" *ngFor="let li of confirmation.lineItems">
            <div class="line__name">{{ li.ticketName }} × {{ li.quantity }}</div>
            <div class="line__price">\${{ li.unitPriceUsd * li.quantity }}</div>
          </div>
        </div>

        <div class="actions">
          <button class="button" type="button" (click)="startOver.emit()" aria-label="Start ticket selection again">
            Start over
          </button>
        </div>

        <p class="hint">
          This is a UI demo only — no payment was processed.
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .confirm {
        margin-top: 14px;
      }

      .card {
        padding: 18px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
      }
      .spark {
        width: 28px;
        height: 28px;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--tc-gradient);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 950;
      }

      .title {
        margin-top: 12px;
        font-size: clamp(22px, 3.2vw, 34px);
        letter-spacing: -0.02em;
        line-height: 1.15;
      }

      .meta {
        margin-top: 12px;
        display: grid;
        gap: 8px;
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(253, 242, 248, 0.6);
      }
      .meta__row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      .label {
        font-size: 12px;
        font-weight: 900;
        color: rgba(55, 65, 81, 0.75);
      }
      .value {
        font-weight: 950;
      }

      .lines {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
      }
      .line__name {
        font-weight: 800;
      }
      .line__price {
        font-weight: 950;
      }

      .actions {
        margin-top: 14px;
      }

      .button {
        width: 100%;
        padding: 12px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-gradient);
        color: rgba(55, 65, 81, 0.95);
        font-weight: 950;
        cursor: pointer;
      }

      .hint {
        margin-top: 10px;
        color: rgba(55, 65, 81, 0.72);
        line-height: 1.6;
      }
    `,
  ],
  inputs: ['confirmation'],
  outputs: ['startOver'],
})
export class TicketConfirmationComponent {
  // PUBLIC_INTERFACE
  /** Confirmation payload produced by the mock checkout. */
  confirmation!: TicketOrderConfirmation;

  // PUBLIC_INTERFACE
  /** Emit when the user wants to start the flow again. */
  startOver = new EventEmitter<void>();
}
