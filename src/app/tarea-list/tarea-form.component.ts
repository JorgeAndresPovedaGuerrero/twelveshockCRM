import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Tarea } from '../models/checklist.model';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.scss']
})
export class TareaFormComponent implements OnInit {
  tarea: Tarea = { nombre: '', descripcion: '', activa: true };
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.apiService.obtenerTareas().subscribe(
        (data: Tarea[]) => {
          const tareaEncontrada = data.find((t) => t.id === id);
          if (tareaEncontrada) {
            this.tarea = tareaEncontrada;
          }
        },
        (error) => {
          console.error('Error al cargar la tarea:', error);
        }
      );
    }
  }

  guardarTarea(): void {
    if (this.isEditing) {
      this.apiService.actualizarTarea(this.tarea.id!, this.tarea).subscribe(
        () => {
          this.router.navigate(['/checklist/tareas']);
        },
        (error) => {
          console.error('Error al actualizar la tarea:', error);
        }
      );
    } else {
      this.apiService.guardarTarea(this.tarea).subscribe(
        () => {
          this.router.navigate(['/checklist/tareas']);
        },
        (error) => {
          console.error('Error al guardar la tarea:', error);
        }
      );
    }
  }
}
