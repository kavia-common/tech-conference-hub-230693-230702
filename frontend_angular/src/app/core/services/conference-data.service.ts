import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { DayId, Session, Speaker, TicketType, TrackId, VenueInfo } from '../models/conference.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ConferenceDataService {
  private readonly config = inject(APP_CONFIG);
  private readonly api = inject(ApiService);

  /**
   * Feature flag:
   * - If NG_APP_API_BASE (preferred) or NG_APP_BACKEND_URL is set, switch to API mode.
   * - Otherwise, serve in-memory mock data (default).
   *
   * SSR-safe: values come from APP_CONFIG which is already SSR-aware (window.__env vs process.env).
   */
  private useApi(): boolean {
    const base = (this.config.apiBase ?? this.config.backendUrl)?.trim() ?? '';
    return base.length > 0;
  }

  /** In-memory dataset for mock mode. */
  private readonly speakersMock: Speaker[] = [
    {
      id: 'maya-chen',
      name: 'Maya Chen',
      title: 'Staff Engineer',
      company: 'Nebula Labs',
      tags: ['Angular', 'Design Systems', 'Accessibility'],
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=480&q=80',
      bio: 'Maya builds inclusive design systems and helps teams ship delightful UI with confidence. She loves component APIs, accessibility audits, and playful gradients.',
      socials: [{ label: 'Website', url: 'https://example.com' }],
    },
    {
      id: 'diego-ramos',
      name: 'Diego Ramos',
      title: 'Principal Engineer',
      company: 'CloudCart',
      tags: ['Platform', 'DevOps', 'Observability'],
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=480&q=80',
      bio: 'Diego designs resilient platforms and teaches teams to read their systems like a story: traces, metrics, and logs—plus the occasional incident postmortem haiku.',
    },
    {
      id: 'aisha-khan',
      name: 'Aisha Khan',
      title: 'AI Product Lead',
      company: 'Kite AI',
      tags: ['AI', 'Product', 'Ethics'],
      photoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=480&q=80',
      bio: 'Aisha helps teams turn prototypes into real products. She focuses on responsible AI, great UX, and shipping learning loops that keep users in the center.',
    },
    {
      id: 'noah-patel',
      name: 'Noah Patel',
      title: 'Senior Frontend Engineer',
      company: 'Sprout Studio',
      tags: ['Frontend', 'Performance', 'Web'],
      photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=480&q=80',
      bio: 'Noah loves making web apps feel instant. He teaches performance fundamentals, animation with intention, and how to keep your bundle on a diet.',
    },
  ];

  private readonly sessionsMock: Session[] = [
    {
      id: 'opening-keynote',
      title: 'Opening Keynote: Build Joyful Tech',
      abstract:
        'A high-energy kickoff on crafting products that feel human: accessible, fast, and sprinkled with delight—without sacrificing engineering rigor.',
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
      abstract:
        'A practical guide to tokens, theming, component contracts, and accessibility—plus tricks for gradients and rounded corners that still feel professional.',
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
      abstract:
        'Make telemetry readable: traces for plot, metrics for pacing, logs for dialogue. Learn how to turn dashboards into narratives your team can act on.',
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
      abstract:
        'How to design evaluations, feedback loops, and UX that keep users in control. Patterns for building trust and iterating safely.',
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
      abstract:
        'A tactical talk on loading strategies, hydration-friendly UI patterns, and designing animations that do not steal time from interaction.',
      speakerIds: ['noah-patel'],
      day: 'day-2',
      startTime: '10:30',
      endTime: '11:15',
      room: 'Room C',
      track: 'frontend',
    },
  ];

  private readonly ticketTypesMock: TicketType[] = [
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

  private readonly venueMock: VenueInfo = {
    name: 'Aurora Convention Center',
    addressLines: ['123 Gradient Blvd', 'Suite 200'],
    cityRegion: 'Bloomtown, CA 94000',
    mapHint: 'Map placeholder — swap in a real map integration later (SSR-safe).',
    travelTips: [
      {
        title: 'From the airport',
        details: 'Take the Blue Line train to Bloomtown Central (25 min), then rideshare ~8 min.',
      },
      { title: 'Parking', details: 'On-site garage available. Arrive early for best spots.' },
      {
        title: 'Food nearby',
        details: 'Lots of quick bites within a 5-minute walk. Look for the taco truck with the neon cat sign.',
      },
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
  getSpeakers() {
    /** Fetch speakers list (mock array or API Observable). */
    return this.useApi() ? this.api.getSpeakers() : of([...this.speakersMock]);
  }

  // PUBLIC_INTERFACE
  getSpeakerById(id: string) {
    /** Fetch a speaker detail (mock or API Observable). */
    return this.useApi()
      ? this.api.getSpeakerById(id)
      : of(this.speakersMock.find((s) => s.id === id) ?? null);
  }

  // PUBLIC_INTERFACE
  getSessions() {
    /** Fetch sessions list (mock or API Observable). */
    return this.useApi() ? this.api.getSessions() : of([...this.sessionsMock]);
  }

  // PUBLIC_INTERFACE
  getSessionById(id: string) {
    /** Fetch a session detail (mock or API Observable). */
    return this.useApi()
      ? this.api.getSessionById(id)
      : of(this.sessionsMock.find((s) => s.id === id) ?? null);
  }

  // PUBLIC_INTERFACE
  getSessionsForSpeaker(speakerId: string) {
    /** Fetch sessions for speaker (mock or API Observable). */
    return this.useApi()
      ? this.api.getSessionsForSpeaker(speakerId)
      : of(this.sessionsMock.filter((s) => s.speakerIds.includes(speakerId)));
  }

  // PUBLIC_INTERFACE
  getTicketTypes() {
    /** Fetch ticket types (mock or API Observable). */
    return this.useApi() ? this.api.getTicketTypes() : of([...this.ticketTypesMock]);
  }

  // PUBLIC_INTERFACE
  getVenueInfo() {
    /** Fetch venue info (mock or API Observable). */
    return this.useApi() ? this.api.getVenueInfo() : of(this.venueMock);
  }

  // PUBLIC_INTERFACE
  getDays(): Array<{ id: DayId; label: string }> {
    /** Return conference days (static taxonomy). */
    return [
      { id: 'day-1', label: 'Day 1' },
      { id: 'day-2', label: 'Day 2' },
    ];
  }

  // PUBLIC_INTERFACE
  getTracks(): Array<{ id: TrackId; label: string }> {
    /** Return track options (static taxonomy). */
    return [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'ai', label: 'AI' },
      { id: 'devops', label: 'DevOps' },
      { id: 'product', label: 'Product' },
    ];
  }
}
