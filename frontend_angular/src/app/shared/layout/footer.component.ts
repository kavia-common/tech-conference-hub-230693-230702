import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    footer {
      padding: 24px 0 34px;
      border-top: 1px solid rgba(55, 65, 81, 0.10);
      margin-top: 26px;
    }

    .wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      opacity: 0.9;
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      font-weight: 650;
    }

    .links a {
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(55, 65, 81, 0.12);
      background: rgba(255, 255, 255, 0.6);
    }
  `],
  template: `
    <footer role="contentinfo">
      <div class="container wrap">
        <div class="muted">
          © {{ year }} Tech Conference Hub · Built with Angular · Mock data
        </div>
        <div class="links" aria-label="Footer navigation">
          <a routerLink="/speakers">Speakers</a>
          <a routerLink="/schedule">Schedule</a>
          <a routerLink="/tickets">Tickets</a>
          <a routerLink="/venue">Venue</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
