import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  filtros: { fechaInicio?: string; fechaFin?: string; } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.apiService.obtenerProductosConFiltros(this.filtros).subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar los productos:', error);
      }
    );
  }

  aplicarFiltros(): void {
    this.cargarProductos();
  }

  limpiarFiltros(): void {
    this.filtros = {};
    this.cargarProductos();
  }

  eliminarProducto(id: string | undefined): void {
    if (id) {
      this.apiService.eliminarProducto(id).subscribe(
        () => {
          this.cargarProductos();
        },
        (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    }
  }
}
