import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Proveedor } from '../models/proveedor';

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.scss']
})
export class ProveedorListComponent implements OnInit {
  proveedores: Proveedor[] = [];
  filtros: { fechaInicio?: string; fechaFin?: string; } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.apiService.obtenerProveedoresConFiltros(this.filtros).subscribe(
      (data: any[]) => {
        console.log('Datos recibidos:', data); // Ver la estructura exacta
        this.proveedores = data;
      },
      (error) => {
        console.error('Error al cargar los proveedores:', error);
      }
    );
  }

  aplicarFiltros(): void {
    this.cargarProveedores();
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.cargarProveedores();
  }

  eliminarProveedor(id: string | undefined): void {
    if (id) {
      this.apiService.eliminarProveedor(id).subscribe(
        () => {
          this.cargarProveedores();
        },
        (error) => {
          console.error('Error al eliminar el proveedor:', error);
        }
      );
    } else {
      console.error('Intento de eliminar un proveedor sin ID');
    }
  }
}
