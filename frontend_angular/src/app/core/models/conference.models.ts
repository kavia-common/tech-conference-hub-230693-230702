/**
 * Shared typed models for Tech Conference Hub.
 * These are used by both mock (in-memory) and API-backed services.
 */
export type DayId = 'day-1' | 'day-2';

export type TrackId = 'frontend' | 'backend' | 'ai' | 'devops' | 'product';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  tags: string[];
  photoUrl: string;
  bio: string;
  socials?: { label: string; url: string }[];
}

export interface Session {
  id: string;
  title: string;
  abstract: string;
  speakerIds: string[];
  day: DayId;
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  room: string;
  track: TrackId;
}

/**
 * Ticket is a purchasable pass type (Standard/VIP/Student).
 * Kept as a friendly alias for `TicketType` to satisfy typed interface requirements.
 */
export interface Ticket {
  id: 'standard' | 'vip' | 'student';
  name: string;
  description: string;
  priceUsd: number;
  perks: string[];
}

export type TicketType = Ticket;

export interface TicketOrderDraft {
  items: Array<{ ticketTypeId: TicketType['id']; quantity: number }>;
  email: string;
}

export interface TicketOrderConfirmation {
  orderId: string;
  createdAtIso: string;
  totalUsd: number;
  email: string;
  lineItems: Array<{ ticketName: string; unitPriceUsd: number; quantity: number }>;
}

/**
 * Venue describes where the conference takes place.
 * Kept as an alias for the existing VenueInfo model to satisfy typed interface requirements.
 */
export interface VenueInfo {
  name: string;
  addressLines: string[];
  cityRegion: string;
  mapHint: string;
  travelTips: Array<{ title: string; details: string }>;
  accessibility: string[];
  contact: {
    email: string;
    phone: string;
  };
}

export type Venue = VenueInfo;
