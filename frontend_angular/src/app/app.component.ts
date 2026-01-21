import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly mobileNavOpen = signal(false);

  toggleMobileNav() {
    this.mobileNavOpen.update((v) => !v);
  }

  closeMobileNav() {
    this.mobileNavOpen.set(false);
  }
}
