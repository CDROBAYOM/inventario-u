import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-container">
      <a routerLink="/" routerLinkActive="active">Inventario</a>
      <a routerLink="/orders" routerLinkActive="active">Solicitudes</a>
    </nav>
  `,
  styles: [`
    .nav-container {
      background-color: #da291c;
      padding: 1rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .nav-container a {
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .nav-container a:hover {
      background-color: #34495e;
      transform: translateY(-2px);
    }
    .nav-container a.active {
      background-color:#d9291c;
      font-weight: 500;
    }
  `]
})
export class NavbarComponent {} 