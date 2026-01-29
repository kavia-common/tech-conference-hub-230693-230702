export type Track = 'Frontend' | 'Backend' | 'AI' | 'Cloud' | 'Career';

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  tags: Track[];
  avatarBg: string; // used for playful avatar placeholder gradient
  social?: {
    website?: string;
    x?: string;
    linkedin?: string;
  };
}

export interface Session {
  id: string;
  title: string;
  description: string;
  track: Track;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  speakerIds: string[];
  room: string;
  startsAtIso: string; // ISO string
  durationMinutes: number;
  tags: string[];
}

export interface TicketType {
  id: 'standard' | 'vip';
  name: string;
  priceUsd: number;
  perks: string[];
}

export interface TicketPurchaseRequest {
  fullName: string;
  email: string;
  ticketTypeId: TicketType['id'];
  quantity: number;
}

export interface TicketPurchaseResult {
  confirmationId: string;
  purchasedAtIso: string;
  request: TicketPurchaseRequest;
  totalUsd: number;
}
