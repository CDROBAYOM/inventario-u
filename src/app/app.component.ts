import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="nav-container">
      <a routerLink="/" routerLinkActive="active">Inventario</a>
      <a routerLink="/orders" routerLinkActive="active">Solicitudes</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .nav-container {
      background-color:hsla(0, 3.30%, 29.60%, 0.91);
      padding: 1rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(253, 253, 253, 0.97);
    }
    .nav-container a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .nav-container a:hover {
      background-color: #e74c3c;
      transform: translateY(-2px);
    }
    .nav-container a.active {
      background-color: #e74c3c;
      font-weight: 500;
    }
  `]
})
export class AppComponent {}
