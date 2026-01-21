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

export interface TicketType {
  id: 'standard' | 'vip' | 'student';
  name: string;
  description: string;
  priceUsd: number;
  perks: string[];
}

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
