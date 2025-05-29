import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav></app-nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      flex: 1;
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      main {
        padding: 0.5rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'inventario-u';
}
