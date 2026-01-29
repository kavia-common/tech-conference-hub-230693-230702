import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    header {
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 14px 0;
      background: linear-gradient(90deg, rgba(70,203,236,0.18), rgba(139,92,246,0.18));
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(55, 65, 81, 0.10);
    }

    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 900;
      letter-spacing: -0.02em;
    }

    .logo {
      width: 36px;
      height: 36px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      box-shadow: 0 10px 26px rgba(139, 92, 246, 0.20);
    }

    nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    a.navlink {
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.14);
      background: rgba(255, 255, 255, 0.65);
      font-weight: 750;
      transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
    }

    a.navlink.active {
      border-color: rgba(70,203,236,0.42);
      box-shadow: 0 12px 28px rgba(70, 203, 236, 0.18);
      background: rgba(70, 203, 236, 0.12);
    }

    a.navlink:hover {
      filter: brightness(1.02);
      transform: translateY(-1px);
    }

    @media (max-width: 720px) {
      .bar {
        align-items: flex-start;
      }
      nav {
        gap: 8px;
      }
      a.navlink {
        padding: 8px 10px;
      }
    }
  `],
  template: `
    <header role="banner">
      <div class="container bar">
        <a class="brand" routerLink="/" aria-label="Tech Conference Hub home">
          <span class="logo" aria-hidden="true"></span>
          <span>Tech Conference Hub</span>
        </a>

        <nav aria-label="Primary">
          <a class="navlink" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a class="navlink" routerLink="/speakers" routerLinkActive="active">Speakers</a>
          <a class="navlink" routerLink="/schedule" routerLinkActive="active">Schedule</a>
          <a class="navlink" routerLink="/tickets" routerLinkActive="active">Tickets</a>
          <a class="navlink" routerLink="/venue" routerLinkActive="active">Venue</a>
        </nav>
      </div>
    </header>
  `,
})
export class NavbarComponent {}
