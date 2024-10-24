import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Gasto } from '../models/gasto';

@Component({
  selector: 'app-gasto-form',
  templateUrl: './gasto-form.component.html',
  styleUrls: ['./gasto-form.component.scss']
})
export class GastoFormComponent implements OnInit {
  gasto: Gasto = { fecha: '', valor: null, concepto: '' };
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
      this.apiService.obtenerGastos().subscribe(
        (data: Gasto[]) => {
          this.gasto = data.find((g) => g.id === id) || this.gasto; // Maneja el caso donde no se encuentra el gasto
        },
        (error) => {
          console.error('Error al cargar el gasto:', error);
        }
      );
    }
  }

  guardarGasto(): void {
    if (this.isEditing) {
      this.apiService.actualizarGasto(this.gasto.id!, this.gasto).subscribe(
        () => {
          this.router.navigate(['/gastos']);
        },
        (error) => {
          console.error('Error al actualizar el gasto:', error);
        }
      );
    } else {
      this.apiService.guardarGasto(this.gasto).subscribe(
        () => {
          this.router.navigate(['/gastos']);
        },
        (error) => {
          console.error('Error al guardar el gasto:', error);
        }
      );
    }
  }
}
