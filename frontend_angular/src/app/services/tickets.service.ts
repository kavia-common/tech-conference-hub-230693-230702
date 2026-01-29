import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_TICKET_TYPES } from '../data/mock-data';
import { TicketPurchaseRequest, TicketPurchaseResult, TicketType } from '../models/conference.models';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private lastPurchase: TicketPurchaseResult | null = null;

  // PUBLIC_INTERFACE
  getTicketTypes(): Observable<TicketType[]> {
    /** Returns available ticket types (mocked). */
    return of(MOCK_TICKET_TYPES);
  }

  // PUBLIC_INTERFACE
  purchaseTickets(req: TicketPurchaseRequest): Observable<TicketPurchaseResult> {
    /** Simulates a purchase and returns a confirmation payload (mocked). */
    if (!req.fullName.trim() || !req.email.trim() || req.quantity < 1) {
      return throwError(() => new Error('Please provide your name, email, and a valid quantity.'));
    }

    const type = MOCK_TICKET_TYPES.find((t) => t.id === req.ticketTypeId);
    if (!type) {
      return throwError(() => new Error('Invalid ticket type.'));
    }

    const totalUsd = type.priceUsd * req.quantity;
    const confirmationId = `TCH-${Math.random().toString(16).slice(2, 8).toUpperCase()}-${Date.now()
      .toString()
      .slice(-4)}`;

    const result: TicketPurchaseResult = {
      confirmationId,
      purchasedAtIso: new Date().toISOString(),
      request: req,
      totalUsd,
    };

    this.lastPurchase = result;
    return of(result);
  }

  // PUBLIC_INTERFACE
  getLastPurchase(): Observable<TicketPurchaseResult | null> {
    /** Returns the last purchase made in this session (mocked). */
    return of(this.lastPurchase);
  }
}
