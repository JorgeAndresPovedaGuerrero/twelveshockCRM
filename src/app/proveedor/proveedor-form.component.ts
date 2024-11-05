import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Proveedor } from '../models/proveedor';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  proveedor: Proveedor = { fechaCreacion: '', codigo: '', nombre: '' };
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
      this.apiService.obtenerProveedores().subscribe(
        (data: Proveedor[]) => {
          this.proveedor = data.find((g) => g.id === id) || this.proveedor; // Maneja el caso donde no se encuentra el proveedor
        },
        (error) => {
          console.error('Error al cargar el proveedor:', error);
        }
      );
    }
  }

  guardarProveedor(): void {
    if (this.isEditing) {
      this.apiService.actualizarProveedor(this.proveedor.id!, this.proveedor).subscribe(
        () => {
          this.router.navigate(['/proveedor']);
        },
        (error) => {
          console.error('Error al actualizar el proveedor:', error);
        }
      );
    } else {
      this.apiService.guardarProveedor(this.proveedor).subscribe(
        () => {
          this.router.navigate(['/proveedor']);
        },
        (error) => {
          console.error('Error al guardar el proveedor:', error);
        }
      );
    }
  }
}
