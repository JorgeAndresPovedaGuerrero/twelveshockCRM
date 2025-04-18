import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tarea } from '../models/checklist.model';

@Component({
  selector: 'app-tarea-list',
  templateUrl: './tarea-list.component.html',
  styleUrls: ['./tarea-list.component.scss']
})
export class TareaListComponent implements OnInit {
  tareas: Tarea[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.apiService.obtenerTareas().subscribe(
      (data: Tarea[]) => {
        this.tareas = data;
      },
      (error) => {
        console.error('Error al cargar las tareas:', error);
      }
    );
  }

  eliminarTarea(id: string | undefined): void {
    if (id) {
      if (confirm('¿Está seguro que desea eliminar esta tarea?')) {
        this.apiService.eliminarTarea(id).subscribe(
          () => {
            this.cargarTareas();
          },
          (error) => {
            console.error('Error al eliminar la tarea:', error);
          }
        );
      }
    }
  }
}
