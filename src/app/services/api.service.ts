import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, Billing } from '../models/order';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/data/orders';
  //private baseUrl = 'https://twelveshockcrmbackend.onrender.com/data/orders';

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

  updateOrder(id: number, order: Order): Observable<Order> {  // Cambia a number
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getHighestOrderId(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/highest-id`);
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

}
