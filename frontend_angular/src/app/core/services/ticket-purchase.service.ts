import { Injectable } from '@angular/core';
import { TicketOrderConfirmation, TicketOrderDraft, TicketType } from '../models/conference.models';

@Injectable({ providedIn: 'root' })
export class TicketPurchaseService {
  // PUBLIC_INTERFACE
  calculateTotalUsd(ticketTypes: TicketType[], draft: TicketOrderDraft): number {
    /** Calculate total from draft using the provided ticket type catalog. */
    return draft.items.reduce((sum, item) => {
      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
      const price = tt?.priceUsd ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }

  // PUBLIC_INTERFACE
  createConfirmation(ticketTypes: TicketType[], draft: TicketOrderDraft): TicketOrderConfirmation {
    /** Create a mock confirmation (no payment) using the provided ticket type catalog. */
    const lineItems = draft.items
      .filter((i) => i.quantity > 0)
      .map((i) => {
        const tt = ticketTypes.find((t) => t.id === i.ticketTypeId);
        return {
          ticketName: tt?.name ?? 'Ticket',
          unitPriceUsd: tt?.priceUsd ?? 0,
          quantity: i.quantity,
        };
      });

    const totalUsd = lineItems.reduce((sum, li) => sum + li.unitPriceUsd * li.quantity, 0);

    // SSR-friendly: avoid crypto APIs; keep it deterministic enough for mock UI.
    const orderId = `TCH-${Math.random().toString(16).slice(2, 8).toUpperCase()}-${Date.now()
      .toString()
      .slice(-4)}`;

    return {
      orderId,
      createdAtIso: new Date().toISOString(),
      totalUsd,
      email: draft.email,
      lineItems,
    };
  }

  // PUBLIC_INTERFACE
  getDefaultDraft(ticketTypes: TicketType[]): TicketOrderDraft {
    /** Create a default draft with 0 quantities. */
    return {
      email: '',
      items: ticketTypes.map((t) => ({ ticketTypeId: t.id, quantity: 0 })),
    };
  }
}
