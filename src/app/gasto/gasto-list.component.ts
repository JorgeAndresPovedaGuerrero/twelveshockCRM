import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Gasto } from '../models/gasto';

@Component({
  selector: 'app-gasto-list',
  templateUrl: './gasto-list.component.html',
  styleUrls: ['./gasto-list.component.scss']
})
export class GastoListComponent implements OnInit {
  gastos: Gasto[] = [];
  filtros: { fechaInicio?: string; fechaFin?: string; concepto?: string; precioMin?: number; precioMax?: number } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.apiService.obtenerGastosConFiltros(this.filtros).subscribe(
      (data: any[]) => {
        console.log('Datos recibidos:', data); // Ver la estructura exacta
        this.gastos = data;
      },
      (error) => {
        console.error('Error al cargar los gastos:', error);
      }
    );
  }

  aplicarFiltros(): void {
    this.cargarGastos();
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.cargarGastos();
  }

  eliminarGasto(id: string | undefined): void {
    if (id) {
      this.apiService.eliminarGasto(id).subscribe(
        () => {
          this.cargarGastos();
        },
        (error) => {
          console.error('Error al eliminar el gasto:', error);
        }
      );
    } else {
      console.error('Intento de eliminar un gasto sin ID');
    }
  }
}
