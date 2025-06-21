import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  username: string = '';
  password: string = '';
  agreeToTerms: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // TODO: Implement signup logic
     if (this.username && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.router.navigate(['/pedidos']);
        },
        error: (error) => {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          this.isLoading = false;
        }
      });
    }   }
} 