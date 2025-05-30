import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { VerificacionContraentrega } from '../models/verificacionContraentrega.model';
import { ToastrService } from 'ngx-toastr';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-contraentrega-list',
  templateUrl: './contraentrega-list.component.html',
  styleUrls: ['./contraentrega-list.component.scss']
})
export class ContraentregaListComponent implements OnInit {
  verificaciones: VerificacionContraentrega[] = [];
  verificacionesOriginales: VerificacionContraentrega[] = [];
  loading = false;
  filtroEstado: string = 'PENDIENTE';
  filtroCiudad: string = '';
  error: string | null = null;

  // Datos de modales
  verificacionSeleccionada: VerificacionContraentrega | null = null;
  usuarioAsesor = '';
  observaciones = '';
  motivoCancelacion = '';

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarVerificaciones();
  }

  cargarVerificaciones(): void {
    this.loading = true;
    this.error = null;

    if (this.filtroCiudad.trim()) {
      this.cargarPorCiudad();
    } else {
      this.cargarPorEstado();
    }
  }

  private cargarPorCiudad(): void {
    this.apiService.obtenerContraentregasPorCiudad(this.filtroCiudad.trim())
      .pipe(
        catchError(error => {
          console.error('Error al cargar verificaciones por ciudad:', error);
          this.error = 'Error al cargar verificaciones por ciudad';
          this.toastr.error('Error al cargar verificaciones por ciudad');
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          this.verificacionesOriginales = data || [];
          this.aplicarFiltros();
        }
      });
  }

  private cargarPorEstado(): void {
    const estado = this.filtroEstado;
    let llamada$;

    switch (estado) {
      case 'PENDIENTE':
        llamada$ = this.apiService.obtenerContraentregasPendientes();
        break;
      case 'VERIFICADO':
      case 'CANCELADO':
        llamada$ = this.apiService.obtenerContraentregasPorEstado(estado);
        break;
      case 'TODOS':
        llamada$ = this.apiService.obtenerTodasLasContraentregas();
        break;
      default:
        llamada$ = this.apiService.obtenerContraentregasPendientes();
    }

    llamada$
      .pipe(
        catchError(error => {
          console.error('Error al cargar verificaciones:', error);
          this.error = `Error al cargar verificaciones: ${error.message || 'Error desconocido'}`;
          this.toastr.error('Error al cargar verificaciones');
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          this.verificacionesOriginales = data || [];
          this.aplicarFiltros();
        }
      });
  }

  private aplicarFiltros(): void {
    let verificacionesFiltradas = [...this.verificacionesOriginales];

    if (this.filtroEstado !== 'TODOS') {
      verificacionesFiltradas = verificacionesFiltradas.filter(v =>
        v.estado === this.filtroEstado
      );
    }

    if (this.filtroCiudad.trim()) {
      verificacionesFiltradas = verificacionesFiltradas.filter(v =>
        v.ciudadEnvio?.toLowerCase().includes(this.filtroCiudad.toLowerCase())
      );
    }

    this.verificaciones = verificacionesFiltradas;
  }

abrirModalVerificar(verificacion: any, modalTemplate: TemplateRef<any>) {
  this.verificacionSeleccionada = verificacion;
  this.usuarioAsesor = ''; // Limpiar campos
  this.observaciones = '';

  // Configuración mejorada para el modal
  const modalRef = this.modalService.open(modalTemplate, {
    centered: true,
    backdrop: 'static',
    keyboard: false,
    windowClass: 'modal-verificar',
    size: 'md',
    container: 'body' // Asegurar que se monte en el body
  });

  // Forzar estilos después de abrir
  setTimeout(() => {
    const modalElement = document.querySelector('.modal');
    const backdropElement = document.querySelector('.modal-backdrop');

    if (modalElement) {
      (modalElement as HTMLElement).style.zIndex = '1050';
      (modalElement as HTMLElement).style.display = 'block';
    }

    if (backdropElement) {
      (backdropElement as HTMLElement).style.zIndex = '1040';
      (backdropElement as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      (backdropElement as HTMLElement).style.opacity = '1';
    }

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }, 50);

  modalRef.result.then((result: any) => {
    document.body.style.overflow = 'auto'; // Restaurar scroll
    console.log('Modal cerrado con resultado:', result);
  }).catch((error: any) => {
    document.body.style.overflow = 'auto'; // Restaurar scroll
    console.log('Modal cancelado o cerrado:', error);
  });
}

abrirModalCancelar(verificacion: any, modalTemplate: TemplateRef<any>) {
  this.verificacionSeleccionada = verificacion;
  this.motivoCancelacion = ''; // Limpiar campos

  // Configuración mejorada para el modal
  const modalRef = this.modalService.open(modalTemplate, {
    centered: true,
    backdrop: 'static',
    keyboard: false,
    windowClass: 'modal-cancelar',
    size: 'md',
    container: 'body' // Asegurar que se monte en el body
  });

  // Forzar estilos después de abrir
  setTimeout(() => {
    const modalElement = document.querySelector('.modal');
    const backdropElement = document.querySelector('.modal-backdrop');

    if (modalElement) {
      (modalElement as HTMLElement).style.zIndex = '1050';
      (modalElement as HTMLElement).style.display = 'block';
    }

    if (backdropElement) {
      (backdropElement as HTMLElement).style.zIndex = '1040';
      (backdropElement as HTMLElement).style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      (backdropElement as HTMLElement).style.opacity = '1';
    }

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }, 50);

  modalRef.result.then((result: any) => {
    document.body.style.overflow = 'auto'; // Restaurar scroll
    console.log('Modal cerrado con resultado:', result);
  }).catch((error: any) => {
    document.body.style.overflow = 'auto'; // Restaurar scroll
    console.log('Modal cancelado o cerrado:', error);
  });
}

cerrarModales(): void {
  this.modalService.dismissAll();
  this.verificacionSeleccionada = null;
  this.usuarioAsesor = '';
  this.observaciones = '';
  this.motivoCancelacion = '';

  // Restaurar scroll del body
  document.body.style.overflow = 'auto';
}

// Método adicional para forzar el cierre si es necesario
cerrarModalActivo(): void {
  const modalStack = this.modalService.hasOpenModals();
  if (modalStack) {
    this.modalService.dismissAll();
  }
}

confirmarVerificacion(): void {
  // Debug: Verificar qué datos tenemos
  console.log('Verificación seleccionada:', this.verificacionSeleccionada);

  if (!this.verificacionSeleccionada) {
    this.toastr.error('Error: No hay verificación seleccionada');
    return;
  }

  // Usar notación de corchetes para acceder a order_id
  const orderId = this.verificacionSeleccionada?.order_id;
  console.log('Order ID:', orderId);

  if (!orderId) {
    this.toastr.error('Error: ID de verificación no válido');
    console.error('Propiedades disponibles:', Object.keys(this.verificacionSeleccionada));
    return;
  }

  if (!this.usuarioAsesor?.trim()) {
    this.toastr.error('Debe ingresar el nombre o ID del asesor');
    return;
  }

  this.loading = true;
  this.apiService.cambiarEstadoVerificacion(
    orderId.toString(),
    'VERIFICADO'
  )
  .pipe(
    finalize(() => this.loading = false)
  )
  .subscribe({
    next: () => {
      this.toastr.success('Pedido marcado como verificado exitosamente');
      this.cerrarModales();
      this.cargarVerificaciones();
    },
    error: (error) => {
      this.toastr.error(error.message || 'Error al marcar como verificado');
    }
  });
}

confirmarCancelacion(): void {
  if (!this.verificacionSeleccionada) {
    this.toastr.error('Error: No hay verificación seleccionada');
    return;
  }

  // Usar notación de corchetes para acceder a order_id
  const orderId = this.verificacionSeleccionada['order_id'];

  if (!orderId) {
    this.toastr.error('Error: ID de verificación no válido');
    return;
  }

  this.loading = true;
  this.apiService.cambiarEstadoVerificacion(
    orderId.toString(),
    'CANCELADO'
  )
  .pipe(
    finalize(() => this.loading = false)
  )
  .subscribe({
    next: () => {
      this.toastr.success('Verificación cancelada exitosamente');
      this.cerrarModales();
      this.cargarVerificaciones();
    },
    error: (error) => {
      this.toastr.error(error.message || 'Error al cancelar verificación');
    }
  });
}

onFiltroChange(): void {
  this.cargarVerificaciones();
}

  getTotalPendiente(): number {
    if (!this.verificaciones || this.verificaciones.length === 0) {
      return 0;
    }

    return this.verificaciones
      .filter(v => v.estado === 'PENDIENTE')
      .reduce((sum, v) => sum + (v.total || 0), 0);
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'badge-pendiente';
      case 'VERIFICADO': return 'badge-verificado';
      case 'CANCELADO': return 'badge-cancelado';
      default: return 'badge-default';
    }
  }

trackByVerificacion(index: number, item: VerificacionContraentrega): string {
  return item.id || item['order_id']?.toString() || index.toString();
}

  limpiarFiltros(): void {
    this.filtroEstado = 'PENDIENTE';
    this.filtroCiudad = '';
    this.error = null;
    this.cargarVerificaciones();
  }

  refrescarDatos(): void {
    this.cargarVerificaciones();
  }

  getConteoEstado(estado: string): number {
    if (!this.verificaciones || this.verificaciones.length === 0) {
      return 0;
    }

    return this.verificaciones.filter(v => v.estado === estado).length;
  }

  hayDatos(): boolean {
    return this.verificaciones && this.verificaciones.length > 0;
  }

  hayError(): boolean {
    return this.error !== null;
  }
}
