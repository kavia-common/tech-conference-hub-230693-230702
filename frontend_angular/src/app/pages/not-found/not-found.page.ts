import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="page">
      <div class="container">
        <div class="surface" style="padding: 18px;">
          <div class="kicker">404</div>
          <h1 class="page__title" style="margin-top: 6px;">Page not found</h1>
          <p class="page__subtitle">That link doesn’t exist. Let’s get you back to the good stuff.</p>

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <a routerLink="/"><app-button variant="primary">Go home</app-button></a>
            <a routerLink="/schedule"><app-button variant="secondary">Browse schedule</app-button></a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NotFoundPage {}
