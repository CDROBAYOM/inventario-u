import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="authService.isLoggedIn()">
      <div class="nav-container">
        <div class="nav-brand">Inventario U</div>
        <div class="nav-links">
          <a routerLink="/pedidos" routerLinkActive="active">Pedidos</a>
          <a routerLink="/orders" routerLinkActive="active">Solicitudes</a>
          <a routerLink="/products" routerLinkActive="active">Productos</a>
          <button class="logout-button" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #333;
      padding: 1rem;
      color: white;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links a.active {
      background-color: #007bff;
    }

    .logout-button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .logout-button:hover {
      background-color: #c82333;
    }
  `]
})
export class NavComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
} 