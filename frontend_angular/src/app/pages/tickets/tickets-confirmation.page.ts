import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketsService } from '../../services/tickets.service';
import { ButtonComponent } from '../../shared/ui/button.component';

@Component({
  selector: 'app-tickets-confirmation-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, UpperCasePipe, NgIf, RouterLink, ButtonComponent],
  template: `
    <section class="page">
      <div class="container" *ngIf="purchase$ | async as purchase; else missing">
        <div class="surface" style="padding: 18px;">
          <div class="kicker">Confirmation</div>
          <h1 class="page__title" style="margin-top: 6px;">You’re in!</h1>
          <p class="page__subtitle">Your mock ticket purchase is confirmed. Save this confirmation ID.</p>

          <div class="alert alert--success">
            <div><strong>Confirmation ID:</strong> {{ purchase.confirmationId }}</div>
            <div><strong>Name:</strong> {{ purchase.request.fullName }}</div>
            <div><strong>Email:</strong> {{ purchase.request.email }}</div>
            <div><strong>Ticket type:</strong> {{ purchase.request.ticketTypeId | uppercase }}</div>
            <div><strong>Quantity:</strong> {{ purchase.request.quantity }}</div>
            <div><strong>Total:</strong> \${{ purchase.totalUsd }}</div>
            <div class="muted" style="margin-top: 6px;">
              Purchased at {{ purchase.purchasedAtIso | date:'medium':'UTC' }} (UTC)
            </div>
          </div>

          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top: 12px;">
            <a routerLink="/schedule"><app-button variant="primary">Build my schedule</app-button></a>
            <a routerLink="/venue"><app-button variant="secondary">Venue info</app-button></a>
          </div>
        </div>
      </div>

      <ng-template #missing>
        <div class="container">
          <div class="alert">
            No recent purchase found. Please <a routerLink="/tickets" style="text-decoration: underline; font-weight: 800;">purchase tickets</a> first.
          </div>
        </div>
      </ng-template>
    </section>
  `,
})
export class TicketsConfirmationPage {
  private ticketsService = inject(TicketsService);
  purchase$ = this.ticketsService.getLastPurchase();
}
