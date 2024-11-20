import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from '../models/auth.model';  // Asegúrate de tener esta interfaz

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  credentials: LoginCredentials = { username: '', password: '' }; // Definir las credenciales

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Método de login
  login(): void {
    this.authService.login(this.credentials).subscribe(
      response => {
        this.router.navigate(['/']);  // Redirigir a la página principal o a donde necesites
      },
      error => {
        console.error('Error de login', error);  // Manejo del error
      }
    );
  }

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
