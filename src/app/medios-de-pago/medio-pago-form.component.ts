import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { MedioPago } from '../models/medio-pago';

@Component({
  selector: 'app-medio-pago-form',
  templateUrl: './medio-pago-form.component.html',
  styleUrls: ['./medio-pago-form.component.scss']
})
export class MedioPagoFormComponent implements OnInit {
  medioPago: MedioPago = { nombre: '', codigo: ''};
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
      this.apiService.obtenerMediosPago().subscribe(
        (data: MedioPago[]) => {
          this.medioPago = data.find((m) => m.id === id) || this.medioPago;
        },
        (error) => console.error('Error al cargar el medio de pago:', error)
      );
    }
  }

  guardarMedioPago(): void {
    if (this.isEditing && this.medioPago.id) {
      this.apiService.actualizarMedioPago(this.medioPago.id, this.medioPago).subscribe(
        () => this.router.navigate(['/medios-pago']),
        (error) => console.error('Error al actualizar medio de pago:', error)
      );
    } else {
      this.apiService.guardarMedioPago(this.medioPago).subscribe(
        () => this.router.navigate(['/medios-pago']),
        (error) => console.error('Error al guardar medio de pago:', error)
      );
    }
  }
}
