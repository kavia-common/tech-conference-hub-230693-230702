import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConferenceDataService } from '../../core/services/conference-data.service';
import { TicketOrderConfirmation, TicketOrderDraft, TicketType } from '../../core/models/conference.models';
import { TicketPurchaseService } from '../../core/services/ticket-purchase.service';
import { TicketConfirmationComponent } from './ticket-confirmation.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketConfirmationComponent],
  template: `
    <section class="page">
      <header class="page__header">
        <div>
          <h1 class="h1">Tickets</h1>
          <p class="lead">
            Choose your pass, pick a quantity, and complete a mock checkout (no payment).
          </p>
        </div>

        <div class="note" aria-label="Mock checkout notice">
          <span class="spark" aria-hidden="true">✦</span>
          <span><strong>Mock flow:</strong> this is a demo confirmation only.</span>
        </div>
      </header>

      <ng-container *ngIf="!confirmation(); else confirmView">
        <div class="layout">
          <div class="left">
            <div class="card">
              <h2 class="h2">Select tickets</h2>

              <div class="types" role="list" aria-label="Ticket types">
                <div class="type" role="listitem" *ngFor="let t of ticketTypes()">
                  <div class="type__head">
                    <div>
                      <div class="type__name">{{ t.name }}</div>
                      <div class="type__desc">{{ t.description }}</div>
                    </div>

                    <div class="price">\${{ t.priceUsd }}</div>
                  </div>

                  <ul class="perks" aria-label="Ticket perks">
                    <li *ngFor="let p of t.perks">{{ p }}</li>
                  </ul>

                  <div class="qty">
                    <label class="label" [for]="'qty_' + t.id">Qty</label>
                    <input
                      class="qty__input"
                      type="number"
                      min="0"
                      max="10"
                      [id]="'qty_' + t.id"
                      [ngModel]="quantityFor(t)"
                      (ngModelChange)="setQuantity(t.id, $event)"
                      [attr.aria-label]="'Quantity for ' + t.name"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <h2 class="h2">Contact</h2>

              <label class="label" for="email">Email</label>
              <input
                id="email"
                class="input"
                type="email"
                [(ngModel)]="draftEmail"
                aria-label="Email for confirmation"
                placeholder="you@example.com"
              />

              <div class="hint">We’ll send your mock confirmation to this address.</div>
            </div>
          </div>

          <aside class="right" aria-label="Order summary">
            <div class="card card--sticky">
              <h2 class="h2">Summary</h2>

              <div class="summary__lines" *ngIf="summaryLines().length; else summaryEmpty">
                <div class="line" *ngFor="let l of summaryLines()">
                  <div class="line__name">{{ l.name }} × {{ l.quantity }}</div>
                  <div class="line__price">\${{ l.subtotal }}</div>
                </div>

                <div class="divider"></div>

                <div class="total">
                  <div class="total__label">Total</div>
                  <div class="total__value">\${{ totalUsd() }}</div>
                </div>
              </div>

              <ng-template #summaryEmpty>
                <div class="empty">
                  Select a ticket quantity to see your total.
                </div>
              </ng-template>

              <button
                class="button"
                type="button"
                (click)="checkout()"
                [disabled]="!canCheckout()"
                aria-label="Complete mock purchase"
              >
                Complete mock purchase
              </button>

              <div class="hint small">
                By clicking, you’ll generate a pretend order ID. No card needed.
              </div>
            </div>
          </aside>
        </div>
      </ng-container>

      <ng-template #confirmView>
        <app-ticket-confirmation
          [confirmation]="confirmation()!"
          (startOver)="reset()"
        />
      </ng-template>
    </section>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin: 0 auto;
        padding: 28px 16px 10px;
      }

      .page__header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        align-items: end;
      }

      .h1 {
        font-size: clamp(28px, 3.8vw, 40px);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }

      .lead {
        margin-top: 10px;
        line-height: 1.6;
        color: rgba(55, 65, 81, 0.85);
        max-width: 72ch;
      }

      .note {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.75);
        box-shadow: var(--tc-shadow-sm);
        color: rgba(55, 65, 81, 0.9);
        font-weight: 650;
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
        font-weight: 900;
      }

      .layout {
        margin-top: 14px;
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 12px;
        align-items: start;
      }

      .card {
        padding: 16px;
        border-radius: var(--tc-radius-lg);
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-surface);
        box-shadow: var(--tc-shadow-sm);
      }

      .card + .card {
        margin-top: 12px;
      }

      .card--sticky {
        position: sticky;
        top: 86px;
      }

      .h2 {
        font-size: 18px;
        letter-spacing: -0.01em;
      }

      .types {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .type {
        padding: 12px;
        border-radius: 16px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: linear-gradient(135deg, rgba(70, 203, 236, 0.1), rgba(139, 92, 246, 0.08));
      }

      .type__head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 10px;
      }

      .type__name {
        font-weight: 950;
        letter-spacing: -0.01em;
      }

      .type__desc {
        margin-top: 4px;
        color: rgba(55, 65, 81, 0.78);
        line-height: 1.5;
      }

      .price {
        display: inline-flex;
        padding: 8px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(55, 65, 81, 0.12);
        font-weight: 950;
        white-space: nowrap;
      }

      .perks {
        margin-top: 10px;
        padding-left: 18px;
        color: rgba(55, 65, 81, 0.8);
        line-height: 1.55;
      }

      .qty {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .label {
        font-size: 12px;
        font-weight: 850;
        color: rgba(55, 65, 81, 0.7);
      }

      .qty__input {
        width: 96px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.85);
        outline: none;
        font-weight: 800;
        text-align: center;
      }
      .qty__input:focus {
        border-color: rgba(70, 203, 236, 0.55);
        box-shadow: 0 0 0 4px rgba(70, 203, 236, 0.18);
      }

      .input {
        margin-top: 8px;
        width: 100%;
        padding: 12px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: rgba(255, 255, 255, 0.8);
        box-shadow: var(--tc-shadow-sm);
        outline: none;
        font-weight: 650;
      }
      .input:focus {
        border-color: rgba(70, 203, 236, 0.55);
        box-shadow: 0 0 0 4px rgba(70, 203, 236, 0.18);
      }

      .hint {
        margin-top: 8px;
        color: rgba(55, 65, 81, 0.72);
        line-height: 1.6;
      }

      .small {
        font-size: 12px;
      }

      .summary__lines {
        margin-top: 12px;
        display: grid;
        gap: 10px;
      }

      .line {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        color: rgba(55, 65, 81, 0.88);
      }

      .line__name {
        font-weight: 750;
      }

      .line__price {
        font-weight: 950;
      }

      .divider {
        height: 1px;
        background: rgba(55, 65, 81, 0.1);
      }

      .total {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
      }

      .total__label {
        font-weight: 850;
        color: rgba(55, 65, 81, 0.82);
      }
      .total__value {
        font-weight: 1000;
        font-size: 18px;
      }

      .empty {
        margin-top: 12px;
        padding: 12px;
        border-radius: 16px;
        border: 1px dashed rgba(55, 65, 81, 0.18);
        color: rgba(55, 65, 81, 0.75);
        background: rgba(253, 242, 248, 0.55);
      }

      .button {
        margin-top: 12px;
        width: 100%;
        padding: 12px 12px;
        border-radius: 999px;
        border: 1px solid rgba(55, 65, 81, 0.12);
        background: var(--tc-gradient);
        color: rgba(55, 65, 81, 0.95);
        font-weight: 950;
        cursor: pointer;
      }

      .button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      @media (max-width: 980px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .card--sticky {
          position: static;
        }
      }

      @media (max-width: 720px) {
        .page__header {
          grid-template-columns: 1fr;
          align-items: start;
        }
      }
    `,
  ],
})
export class TicketsComponent {
  private readonly data = inject(ConferenceDataService);
  private readonly purchase = inject(TicketPurchaseService);

  protected readonly ticketTypes = signal<TicketType[]>([]);
  private draft = signal<TicketOrderDraft>({ email: '', items: [] });
  protected draftEmail = '';

  protected readonly confirmation = signal<TicketOrderConfirmation | null>(null);

  constructor() {
    this.data.getTicketTypes().subscribe((types) => {
      this.ticketTypes.set(types);
      // Initialize draft once we have the ticket catalog.
      if (!this.draft().items.length) {
        this.draft.set(this.purchase.getDefaultDraft(types));
      }
    });
  }

  readonly totalUsd = computed(() =>
    this.purchase.calculateTotalUsd(this.ticketTypes(), { ...this.draft(), email: this.draftEmail }),
  );

  readonly summaryLines = computed(() => {
    const types = this.ticketTypes();
    const d = this.draft();

    return d.items
      .filter((i) => i.quantity > 0)
      .map((i) => {
        const t = types.find((x) => x.id === i.ticketTypeId);
        const name = t?.name ?? 'Ticket';
        const unit = t?.priceUsd ?? 0;
        return { name, quantity: i.quantity, subtotal: unit * i.quantity };
      });
  });

  canCheckout(): boolean {
    const hasItems = this.summaryLines().length > 0;
    const emailOk = this.draftEmail.trim().includes('@');
    return hasItems && emailOk;
  }

  quantityFor(t: TicketType): number {
    const item = this.draft().items.find((i) => i.ticketTypeId === t.id);
    return item?.quantity ?? 0;
  }

  setQuantity(typeId: TicketType['id'], quantityInput: unknown) {
    const quantity = Math.max(0, Math.min(10, Number(quantityInput) || 0));
    const current = this.draft();

    this.draft.set({
      ...current,
      items: current.items.map((i) => (i.ticketTypeId === typeId ? { ...i, quantity } : i)),
    });
  }

  checkout() {
    const draft = { ...this.draft(), email: this.draftEmail.trim() };

    if (!this.canCheckout()) return;

    this.confirmation.set(this.purchase.createConfirmation(this.ticketTypes(), draft));
  }

  reset() {
    this.confirmation.set(null);
    this.draftEmail = '';
    this.draft.set(this.purchase.getDefaultDraft(this.ticketTypes()));
  }
}
