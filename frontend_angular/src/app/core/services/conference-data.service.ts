import { Injectable } from '@angular/core';
import { DayId, Session, Speaker, TicketType, TrackId, VenueInfo } from '../models/conference.models';

@Injectable({ providedIn: 'root' })
export class ConferenceDataService {
  /** Temporary in-memory stub; will be replaced by real API in a later step. */
  private readonly speakers: Speaker[] = [
    {
      id: 'maya-chen',
      name: 'Maya Chen',
      title: 'Staff Engineer',
      company: 'Nebula Labs',
      tags: ['Angular', 'Design Systems', 'Accessibility'],
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=480&q=80',
      bio: 'Maya builds inclusive design systems and helps teams ship delightful UI with confidence. She loves component APIs, accessibility audits, and playful gradients.',
      socials: [{ label: 'Website', url: 'https://example.com' }]
    },
    {
      id: 'diego-ramos',
      name: 'Diego Ramos',
      title: 'Principal Engineer',
      company: 'CloudCart',
      tags: ['Platform', 'DevOps', 'Observability'],
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=480&q=80',
      bio: 'Diego designs resilient platforms and teaches teams to read their systems like a story: traces, metrics, and logs—plus the occasional incident postmortem haiku.'
    },
    {
      id: 'aisha-khan',
      name: 'Aisha Khan',
      title: 'AI Product Lead',
      company: 'Kite AI',
      tags: ['AI', 'Product', 'Ethics'],
      photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=480&q=80',
      bio: 'Aisha helps teams turn prototypes into real products. She focuses on responsible AI, great UX, and shipping learning loops that keep users in the center.'
    },
    {
      id: 'noah-patel',
      name: 'Noah Patel',
      title: 'Senior Frontend Engineer',
      company: 'Sprout Studio',
      tags: ['Frontend', 'Performance', 'Web'],
      photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=480&q=80',
      bio: 'Noah loves making web apps feel instant. He teaches performance fundamentals, animation with intention, and how to keep your bundle on a diet.'
    },
  ];

  /** Temporary in-memory stub; will be replaced by real API in a later step. */
  private readonly sessions: Session[] = [
    {
      id: 'opening-keynote',
      title: 'Opening Keynote: Build Joyful Tech',
      abstract: 'A high-energy kickoff on crafting products that feel human: accessible, fast, and sprinkled with delight—without sacrificing engineering rigor.',
      speakerIds: ['maya-chen', 'aisha-khan'],
      day: 'day-1',
      startTime: '09:00',
      endTime: '09:45',
      room: 'Main Stage',
      track: 'product',
    },
    {
      id: 'design-systems-playful',
      title: 'Playful Design Systems in Angular',
      abstract: 'A practical guide to tokens, theming, component contracts, and accessibility—plus tricks for gradients and rounded corners that still feel professional.',
      speakerIds: ['maya-chen'],
      day: 'day-1',
      startTime: '10:15',
      endTime: '11:00',
      room: 'Room A',
      track: 'frontend',
    },
    {
      id: 'observability-story',
      title: 'Observability as a Storytelling Tool',
      abstract: 'Make telemetry readable: traces for plot, metrics for pacing, logs for dialogue. Learn how to turn dashboards into narratives your team can act on.',
      speakerIds: ['diego-ramos'],
      day: 'day-1',
      startTime: '11:15',
      endTime: '12:00',
      room: 'Room B',
      track: 'devops',
    },
    {
      id: 'ai-product-loops',
      title: 'AI Product Loops: Shipping with Guardrails',
      abstract: 'How to design evaluations, feedback loops, and UX that keep users in control. Patterns for building trust and iterating safely.',
      speakerIds: ['aisha-khan'],
      day: 'day-2',
      startTime: '09:30',
      endTime: '10:15',
      room: 'Room A',
      track: 'ai',
    },
    {
      id: 'perf-with-intention',
      title: 'Performance with Intention',
      abstract: 'A tactical talk on loading strategies, hydration-friendly UI patterns, and designing animations that do not steal time from interaction.',
      speakerIds: ['noah-patel'],
      day: 'day-2',
      startTime: '10:30',
      endTime: '11:15',
      room: 'Room C',
      track: 'frontend',
    },
  ];

  private readonly ticketTypes: TicketType[] = [
    {
      id: 'standard',
      name: 'Standard Pass',
      description: 'Full conference access + hallway track magic.',
      priceUsd: 199,
      perks: ['All sessions', 'Expo floor', 'Talk recordings'],
    },
    {
      id: 'vip',
      name: 'VIP Pass',
      description: 'Extra comfy seating + speaker lounge vibes.',
      priceUsd: 349,
      perks: ['All Standard perks', 'VIP seating', 'Speaker meet-and-greet'],
    },
    {
      id: 'student',
      name: 'Student Pass',
      description: 'Budget-friendly access (student ID required).',
      priceUsd: 99,
      perks: ['All sessions', 'Career corner', 'Study-group tables'],
    },
  ];

  private readonly venue: VenueInfo = {
    name: 'Aurora Convention Center',
    addressLines: ['123 Gradient Blvd', 'Suite 200'],
    cityRegion: 'Bloomtown, CA 94000',
    mapHint: 'Map placeholder — swap in a real map integration later (SSR-safe).',
    travelTips: [
      { title: 'From the airport', details: 'Take the Blue Line train to Bloomtown Central (25 min), then rideshare ~8 min.' },
      { title: 'Parking', details: 'On-site garage available. Arrive early for best spots.' },
      { title: 'Food nearby', details: 'Lots of quick bites within a 5-minute walk. Look for the taco truck with the neon cat sign.' },
    ],
    accessibility: [
      'Step-free entrance and elevators to all levels',
      'Reserved seating available in all rooms',
      'Quiet room available near Registration',
      'Captioning on keynote sessions',
    ],
    contact: {
      email: 'help@techconfhub.example',
      phone: '+1 (555) 010-2024',
    },
  };

  // PUBLIC_INTERFACE
  getSpeakers(): Speaker[] {
    /** Return speakers (stub). */
    return [...this.speakers];
  }

  // PUBLIC_INTERFACE
  getSpeakerById(id: string): Speaker | undefined {
    /** Return one speaker (stub). */
    return this.speakers.find((s) => s.id === id);
  }

  // PUBLIC_INTERFACE
  getSessions(): Session[] {
    /** Return sessions (stub). */
    return [...this.sessions];
  }

  // PUBLIC_INTERFACE
  getSessionById(id: string): Session | undefined {
    /** Return one session (stub). */
    return this.sessions.find((s) => s.id === id);
  }

  // PUBLIC_INTERFACE
  getSessionsForSpeaker(speakerId: string): Session[] {
    /** Return sessions for a speaker (stub). */
    return this.sessions.filter((s) => s.speakerIds.includes(speakerId));
  }

  // PUBLIC_INTERFACE
  getTicketTypes(): TicketType[] {
    /** Return ticket types (stub). */
    return [...this.ticketTypes];
  }

  // PUBLIC_INTERFACE
  getVenueInfo(): VenueInfo {
    /** Return venue info (stub). */
    return this.venue;
  }

  // PUBLIC_INTERFACE
  getDays(): Array<{ id: DayId; label: string }> {
    /** Return conference days (stub). */
    return [
      { id: 'day-1', label: 'Day 1' },
      { id: 'day-2', label: 'Day 2' },
    ];
  }

  // PUBLIC_INTERFACE
  getTracks(): Array<{ id: TrackId; label: string }> {
    /** Return track options (stub). */
    return [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'ai', label: 'AI' },
      { id: 'devops', label: 'DevOps' },
      { id: 'product', label: 'Product' },
    ];
  }
}
