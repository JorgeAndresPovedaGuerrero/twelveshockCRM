import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { ResumenProgreso } from '../models/checklist.model';
import { formatDate } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  credentials = { username: '', password: '' };
  showProgressBar = true;
  resumenProgreso: ResumenProgreso = { totalTareas: 0, tareasCompletadas: 0, porcentajeCompletado: 0 };
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Cargar el resumen de progreso al inicializar
    this.cargarResumenProgreso();

    // Actualizar el resumen cada vez que se cambia de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cargarResumenProgreso();
    });

    // Esta es la parte clave: suscribirse al evento de tarea actualizada
    this.apiService.tareaActualizada$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.cargarResumenProgreso();
    });
  }

  ngOnDestroy(): void {
    // Limpieza de suscripciones para evitar memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarResumenProgreso(): void {
    const fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.apiService.obtenerResumenProgreso(fechaHoy).subscribe(
      (resumen: ResumenProgreso) => {
        this.resumenProgreso = resumen;
      },
      (error) => {
        console.error('Error al cargar el resumen de progreso:', error);
      }
    );
  }

  getProgressBarColor(porcentaje: number): string {
    if (porcentaje < 40) {
      return '#dc3545'; // bg-danger (rojo)
    } else if (porcentaje >= 40 && porcentaje < 60) {
      return '#ffc107'; // bg-warning (amarillo)
    } else if (porcentaje >= 60 && porcentaje < 90) {
      return '#17a2b8'; // bg-info (azul)
    } else {
      return '#28a745'; // bg-success (verde)
    }
  }

  login(): void {
    this.authService.login(this.credentials).subscribe(
      response => {
        this.router.navigate(['/']);
        this.cargarResumenProgreso();
      },
      error => {
        console.error('Error de login', error);
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
