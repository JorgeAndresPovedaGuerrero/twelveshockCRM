import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tarea, ProgresoTarea, ResumenProgreso, TareaConEstado } from '../models/checklist.model';
import { formatDate } from '@angular/common';


// Interfaz para el historial
interface ProgresoHistorial {
  fecha: string;
  tareasCompletadas: number;
  totalTareas: number;
  porcentajeCompletado: number;
}

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {
  fechaActual: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  progresoDiario: ProgresoTarea | null = null;
  tareas: Tarea[] = [];
  tareasConEstado: TareaConEstado[] = [];
  resumenProgreso: ResumenProgreso = { totalTareas: 0, tareasCompletadas: 0, porcentajeCompletado: 0 };
  showProgressBar = true;

    // Variables para el historial
    fechaInicio: string = formatDate(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd', 'en'); // 7 días atrás por defecto
    fechaFin: string = formatDate(new Date(), 'yyyy-MM-dd', 'en'); // Fecha actual
    historialProgreso: ProgresoHistorial[] = [];
    historialConsultado: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarProgresoDelDia();
  }

    // Método para cargar el historial de progreso
    cargarHistorialProgreso(): void {
      this.historialConsultado = true;

      // Validar que la fecha fin no sea anterior a la fecha inicio
      if (new Date(this.fechaFin) < new Date(this.fechaInicio)) {
        alert('La fecha fin no puede ser anterior a la fecha inicio');
        return;
      }

      this.apiService.obtenerHistorialProgreso(this.fechaInicio, this.fechaFin).subscribe(
        (historial: ProgresoHistorial[]) => {
          this.historialProgreso = historial;
        },
        (error) => {
          console.error('Error al cargar el historial de progreso:', error);
          this.historialProgreso = [];
        }
      );
    }

    // Para el color de la barra de progreso
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

  cargarProgresoDelDia(): void {
    // 1. Obtener las tareas activas
    this.apiService.obtenerTareasActivas().subscribe(
      (tareas: Tarea[]) => {
        this.tareas = tareas;
        console.log('Tareas activas cargadas:', tareas);

        // 2. Obtener el progreso del día seleccionado
        this.apiService.obtenerProgresoPorFecha(this.fechaActual).subscribe(
          (progreso: ProgresoTarea) => {
            this.progresoDiario = progreso;
            console.log('Progreso del día cargado:', progreso);

            // 3. Combinar tareas con su estado
            this.combinarTareasConEstado();

            // 4. Cargar el resumen de progreso
            this.cargarResumenProgreso();
          },
          (error) => {
            console.error('Error al cargar el progreso del día:', error);
            // Si hubo error, intentar inicializar el progreso del día
            this.inicializarProgresoDiario();
          }
        );
      },
      (error) => {
        console.error('Error al cargar las tareas activas:', error);
      }
    );
  }

  inicializarProgresoDiario(): void {
    console.log('Inicializando progreso diario para la fecha:', this.fechaActual);
    this.apiService.inicializarProgresoDiario(this.fechaActual).subscribe(
      (progreso: ProgresoTarea) => {
        this.progresoDiario = progreso;
        this.combinarTareasConEstado();
        this.cargarResumenProgreso();
      },
      (error) => {
        console.error('Error al inicializar el progreso del día:', error);
        // Si falla la inicialización, al menos mostrar las tareas sin estado
        this.tareasConEstado = this.tareas.map(tarea => ({
          ...tarea,
          estado: 0
        }));
        // Crear un resumen básico
        this.resumenProgreso = {
          totalTareas: this.tareas.length,
          tareasCompletadas: 0,
          porcentajeCompletado: 0
        };
      }
    );
  }

  combinarTareasConEstado(): void {
    if (!this.progresoDiario) {
      // Si no hay progreso diario, muestra todas las tareas como no completadas
      this.tareasConEstado = this.tareas.map(tarea => ({
        ...tarea,
        estado: 0
      }));
      return;
    }

    // Combina las tareas con su estado correspondiente
    this.tareasConEstado = this.tareas.map(tarea => {
      const estado = this.progresoDiario?.tareas[tarea.id!] ?? 0;
      return {
        ...tarea,
        estado: estado
      };
    });

    console.log('Tareas combinadas con estado:', this.tareasConEstado);
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

  actualizarEstadoTarea(tarea: TareaConEstado): void {
    if (!this.progresoDiario || !tarea.id) return;

    this.apiService.actualizarEstadoTarea(this.progresoDiario.id!, tarea.id, tarea.estado).subscribe(
      () => {
        // Actualizar el resumen después de actualizar una tarea
        this.cargarResumenProgreso();
      },
      (error) => {
        console.error('Error al actualizar el estado de la tarea:', error);
      }
    );
  }
}
