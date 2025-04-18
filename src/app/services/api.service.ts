import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpParams } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { Order, Billing } from '../models/order';
import { LogProduct } from '../models/logProduct';
import { catchError, tap } from 'rxjs/operators';
import { Gasto } from '../models/gasto';
import { Proveedor } from '../models/proveedor';
import { Tarea, ProgresoTarea, ResumenProgreso } from '../models/checklist.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/data/orders';
  private baseUrlLogs = 'http://localhost:8080/api/logs/order/';
  private baseUrlGastos = 'http://localhost:8080/gastos';
  private baseUrlProveedor = 'http://localhost:8080/proveedor';
  //private baseUrl = 'https://twelveshockcrmb.onrender.com/data/orders';
  //private baseUrlLogs = 'https://twelveshockcrmb.onrender.com/api/logs/order';
  //private baseUrlGastos = 'https://twelveshockcrmb.onrender.com/gastos';
  //private baseUrlProveedor = 'https://twelveshockcrmb.onrender.com/proveedor';
  private baseUrlTareas = 'http://localhost:8080/tareas';
  private baseUrlChecklist = 'http://localhost:8080/checklist';

  private tareaActualizadaSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  getOrders(filters: { status?: string; startDate?: string; endDate?: string } = {}): Observable<Order[]> {
    let params = new HttpParams();
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    return this.http.get<Order[]>(this.baseUrl, { params });
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getHighestOrderId(isManual: boolean): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/highest-id?isManual=${isManual}`);
}

  getClientId(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/highest-client-id`); // Ajusta la URL según tu endpoint real
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBillingData(idCliente: number): Observable<Billing> {
    return this.http.get<Billing>(`${this.baseUrl}/billing/${idCliente}`);
  }

  getOrderLogs(orderId: number): Observable<LogProduct[]> {
    return this.http.get<LogProduct[]>(`${this.baseUrlLogs}/${orderId}`)
      .pipe(
        tap(response => console.log('Logs recibidos:', response)),
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Error detallado:', error);
    let errorMessage = 'Ocurrió un error al procesar la solicitud';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  //Metodos para el apartado de gastos
  obtenerGastos(): Observable<any> {
    return this.http.get(this.baseUrlGastos);
  }

  guardarGasto(gasto: any): Observable<any> {
    return this.http.post(this.baseUrlGastos, gasto);
  }

  actualizarGasto(id: string, gasto: any): Observable<any> {
    return this.http.put(`${this.baseUrlGastos}/${id}`, gasto);
  }

  eliminarGasto(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrlGastos}/${id}`);
  }

  obtenerGastosConFiltros(filtros: { fechaInicio?: string; fechaFin?: string; concepto?: string; precioMin?: number; precioMax?: number }): Observable<Gasto[]> {
    let params = new HttpParams();

    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }
    if (filtros.concepto) {
      params = params.set('concepto', filtros.concepto);
    }
    if (filtros.precioMin != null) {  // Cambia a != null para manejar undefined y null
      params = params.set('precioMin', filtros.precioMin.toString());
    }
    if (filtros.precioMax != null) {  // Cambia a != null para manejar undefined y null
      params = params.set('precioMax', filtros.precioMax.toString());
    }

    return this.http.get<Gasto[]>(this.baseUrlGastos + '/buscar', { params })
      .pipe(catchError(this.handleError));
  }
  // ||------------------------- ||
  // Metodos para el apartado de proveedores
  // ||------------------------- ||
  obtenerProveedores(): Observable<any> {
    return this.http.get(this.baseUrlProveedor).pipe(
      tap(data => console.log('Proveedores cargados:', data)),
      catchError(error => {
        console.error('Error cargando proveedores:', error);
        return throwError(() => error);
      })
    );
  }

  guardarProveedor(proveedor: any): Observable<any> {
    return this.http.post(this.baseUrlProveedor, proveedor);
  }

  actualizarProveedor(id: string, proveedor: any): Observable<any> {
    return this.http.put(`${this.baseUrlProveedor}/${id}`, proveedor);
  }

  eliminarProveedor(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrlProveedor}/${id}`);
  }

  obtenerProveedoresConFiltros(filtros: { fechaInicio?: string; fechaFin?: string; }): Observable<Proveedor[]> {
    let params = new HttpParams();

    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }

    return this.http.get<Proveedor[]>(this.baseUrlProveedor + '/buscar', { params })
      .pipe(catchError(this.handleError));
  }

    // ||------------------------- ||
  // Metodos para el apartado de Checklist
  // ||------------------------- ||

  obtenerHistorialProgreso(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlTareas}/checklist/historial?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  obtenerTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.baseUrlTareas).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTareasActivas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.baseUrlTareas}/activas`).pipe(
      catchError(this.handleError)
    );
  }

  guardarTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.baseUrlTareas, tarea).pipe(
      catchError(this.handleError)
    );
  }

  actualizarTarea(id: string, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.baseUrlTareas}/${id}`, tarea).pipe(
      catchError(this.handleError)
    );
  }

  eliminarTarea(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrlTareas}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Métodos para Progreso de Tareas (checklist)
  obtenerProgresoPorFecha(fecha: string): Observable<ProgresoTarea> {
    return this.http.get<ProgresoTarea>(`${this.baseUrlChecklist}/progreso/${fecha}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerResumenProgreso(fecha: string): Observable<ResumenProgreso> {
    return this.http.get<ResumenProgreso>(`${this.baseUrlChecklist}/resumen/${fecha}`).pipe(
      catchError(this.handleError)
    );
  }

  inicializarProgresoDiario(fecha: string): Observable<ProgresoTarea> {
    return this.http.post<ProgresoTarea>(`${this.baseUrlChecklist}/inicializar/${fecha}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // En api.service.ts
  actualizarEstadoTarea(progresoId: string, tareaId: string, estado: number): Observable<any> {
    const url = `${this.baseUrlChecklist}/tarea/${progresoId}/${tareaId}/${estado}`;
    return this.http.put(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Método para notificar que una tarea ha sido actualizada
  notificarTareaActualizada(): void {
    this.tareaActualizadaSubject.next();
  }

  // Observable al que se pueden suscribir los componentes
  get tareaActualizada$(): Observable<void> {
    return this.tareaActualizadaSubject.asObservable();
  }


}
