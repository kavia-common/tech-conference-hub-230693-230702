import { Injectable } from '@angular/core';
import { TicketOrderConfirmation, TicketOrderDraft, TicketType } from '../models/conference.models';
import { ConferenceDataService } from './conference-data.service';

@Injectable({ providedIn: 'root' })
export class TicketPurchaseService {
  constructor(private readonly data: ConferenceDataService) {}

  // PUBLIC_INTERFACE
  calculateTotalUsd(draft: TicketOrderDraft): number {
    /** Calculate total from draft (stub). */
    const types = this.data.getTicketTypes();
    return draft.items.reduce((sum, item) => {
      const tt = types.find((t) => t.id === item.ticketTypeId);
      const price = tt?.priceUsd ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }

  // PUBLIC_INTERFACE
  createConfirmation(draft: TicketOrderDraft): TicketOrderConfirmation {
    /** Create a mock confirmation (no payment). */
    const types = this.data.getTicketTypes();

    const lineItems = draft.items
      .filter((i) => i.quantity > 0)
      .map((i) => {
        const tt = types.find((t) => t.id === i.ticketTypeId);
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
