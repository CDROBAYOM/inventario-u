import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nav.component.html',
  styleUrls: []
})
export class NavComponent {
  darkMode = false;

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
} 