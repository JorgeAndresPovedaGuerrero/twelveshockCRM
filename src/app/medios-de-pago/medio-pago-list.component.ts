import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MedioPago } from '../models/medio-pago';

@Component({
  selector: 'app-medio-pago-list',
  templateUrl: './medio-pago-list.component.html',
  styleUrls: ['./medio-pago-list.component.scss']
})
export class MedioPagoListComponent implements OnInit {
  mediosPago: MedioPago[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarMediosPago();
  }

  cargarMediosPago(): void {
    this.apiService.obtenerMediosPago().subscribe(
      (data: MedioPago[]) => this.mediosPago = data,
      (error) => console.error('Error al cargar los medios de pago:', error)
    );
  }

  eliminarMedioPago(id: string | undefined): void {
    if (id) {
      this.apiService.eliminarMedioPago(id).subscribe(
        () => this.cargarMediosPago(),
        (error) => console.error('Error al eliminar medio de pago:', error)
      );
    }
  }
}
