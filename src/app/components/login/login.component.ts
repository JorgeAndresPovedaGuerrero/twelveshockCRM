import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService, // Inyecta el AuthService
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); // Redirigir a la página principal o a donde necesites
        },
        error: (error) => {
          this.error = error.error.message || 'Error al iniciar sesión';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
