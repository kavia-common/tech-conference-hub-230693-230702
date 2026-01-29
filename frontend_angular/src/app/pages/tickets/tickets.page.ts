import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { TicketPurchaseRequest, TicketType } from '../../models/conference.models';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, ReactiveFormsModule, RouterLink, ButtonComponent, CardComponent],
  styles: [`
    .types {
      display: grid;
      gap: 12px;
      margin: 14px 0 18px;
    }
    .typeHeader {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .price {
      font-weight: 950;
      font-size: 1.2rem;
      background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    ul {
      margin-top: 10px;
      padding-left: 18px;
      line-height: 1.6;
      opacity: 0.95;
    }
    .panel {
      padding: 18px;
    }
    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
  `],
  template: `
    <section class="page">
      <div class="container">
        <h1 class="page__title">Tickets</h1>
        <p class="page__subtitle">Choose your pass and reserve your spot. (Mock checkout—no real payment.)</p>

        <div class="grid cols-2">
          <div class="surface panel">
            <h2 class="section__title">Ticket options</h2>

            <div class="types" *ngIf="types$ | async as types; else loading">
              <app-card *ngFor="let t of types" [ariaLabel]="t.name">
                <div class="typeHeader">
                  <div>
                    <div class="card__title">{{ t.name }}</div>
                    <div class="muted">Best for {{ t.id === 'vip' ? 'extra networking + perks' : 'full-day access' }}.</div>
                  </div>
                  <div class="price">\${{ t.priceUsd }}</div>
                </div>
                <ul>
                  <li *ngFor="let perk of t.perks">{{ perk }}</li>
                </ul>
              </app-card>
            </div>

            <ng-template #loading>
              <div class="alert">Loading ticket types…</div>
            </ng-template>
          </div>

          <div class="surface panel">
            <h2 class="section__title">Purchase</h2>

            <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="field">
                <label for="fullName">Full name</label>
                <input id="fullName" type="text" formControlName="fullName" autocomplete="name" />
                <div class="field__help">Used on your badge.</div>
              </div>

              <div class="field">
                <label for="email">Email</label>
                <input id="email" type="email" formControlName="email" autocomplete="email" />
                <div class="field__help">We’ll send a (mock) confirmation.</div>
              </div>

              <div class="field">
                <label for="ticketTypeId">Ticket type</label>
                <select id="ticketTypeId" formControlName="ticketTypeId">
                  <option value="standard">Standard</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div class="field">
                <label for="quantity">Quantity</label>
                <input id="quantity" type="number" min="1" max="10" formControlName="quantity" />
              </div>

              <div class="alert alert--error" *ngIf="error">{{ error }}</div>

              <div class="actions">
                <app-button type="submit" variant="primary" [disabled]="form.invalid || submitting">
                  {{ submitting ? 'Processing…' : 'Complete purchase' }}
                </app-button>
                <a routerLink="/schedule"><app-button variant="ghost" type="button">View schedule</app-button></a>
              </div>

              <div class="field__help">
                Tip: This is a mock flow—no payments, no backend.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TicketsPage {
  private fb = inject(FormBuilder);
  private ticketsService = inject(TicketsService);
  private router = inject(Router);

  types$ = this.ticketsService.getTicketTypes();

  error: string | null = null;
  submitting = false;

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    ticketTypeId: 'standard' as TicketType['id'],
    quantity: 1,
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.error = null;
    this.submitting = true;

    const req: TicketPurchaseRequest = {
      fullName: this.form.controls.fullName.value,
      email: this.form.controls.email.value,
      ticketTypeId: this.form.controls.ticketTypeId.value,
      quantity: this.form.controls.quantity.value,
    };

    this.ticketsService.purchaseTickets(req).subscribe({
      next: () => {
        this.submitting = false;
        void this.router.navigate(['/tickets/confirmation']);
      },
      error: (e: unknown) => {
        this.submitting = false;
        this.error = e instanceof Error ? e.message : 'Purchase failed.';
      },
    });
  }
}
