import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = []; // Propiedad para almacenar órdenes filtradas
  statusOptions: string[] = ['processing', 'en proceso', 'pendiente saldo', 'cancelado', 'enviado', 'finalizado'];
  selectedStatus: string = '';
  startDate: string = '';
  endDate: string = '';
  messageSubscription: Subscription | undefined;
  successMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.messageSubscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = null;
        }, 5000); // El mensaje desaparecerá después de 5 segundos
      }
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }

  loadOrders(): void {
    this.apiService.getOrders({
      status: this.selectedStatus,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders; // Inicialmente todos los pedidos están filtrados
        this.toastr.success('Órdenes cargadas correctamente', 'Éxito');
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.toastr.error('Error al cargar las órdenes', 'Error');
      }
    });
  }

  filterOrders(): void {
    this.apiService.getOrders({
      status: this.selectedStatus,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: (orders) => {
        this.filteredOrders = orders;
        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      error: (err) => {
        console.error('Error filtering orders:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-confirmar';
      case 'en proceso':
        return 'status-procesando';
      case 'pendiente saldo':
        return 'status-saldo';
      case 'cancelado':
        return 'status-cancelado';
      case 'enviado':
        return 'status-enviado';
      case 'finalizado':
        return 'status-finalizado';
      default:
        return '';
    }
  }
}
