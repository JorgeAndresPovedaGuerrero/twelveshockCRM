import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {
  producto: Producto = { fechaCreacion: '', codigo: '', nombre: '' };
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
      this.apiService.obtenerProductos().subscribe(
        (data: Producto[]) => {
          this.producto = data.find((p) => p.id === id) || this.producto;
        },
        (error) => {
          console.error('Error al cargar el producto:', error);
        }
      );
    }
  }

  guardarProducto(): void {
    if (this.isEditing) {
      this.apiService.actualizarProducto(this.producto.id!, this.producto).subscribe(
        () => {
          this.router.navigate(['/productos']);
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
        }
      );
    } else {
      this.apiService.guardarProducto(this.producto).subscribe(
        () => {
          this.router.navigate(['/productos']);
        },
        (error) => {
          console.error('Error al guardar el producto:', error);
        }
      );
    }
  }
}
