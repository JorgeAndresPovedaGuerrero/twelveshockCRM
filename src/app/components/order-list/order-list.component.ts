import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderEditModalComponent } from '../../order-edit-modal/order-edit-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
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
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.messageSubscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = null;
        }, 5000);
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
        this.filteredOrders = orders;
        this.toastr.success('Órdenes cargadas correctamente', 'Éxito');
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.toastr.error('Error al cargar las órdenes', 'Error');
      }
    });
  }

  filterOrders(): void {
    const possibleStatuses = this.getPossibleStatuses(this.selectedStatus);

    if (possibleStatuses.length === 0) {  
      // Si no hay estados posibles, mostrar todos los registros
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order =>
        possibleStatuses.includes(order.status.trim().toLowerCase())
      );
    }

    this.cdr.detectChanges();
  }

  getPossibleStatuses(status: string): string[] {
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === '' || normalizedStatus === 'todos') {
      // Retorna una lista vacía o un wildcard que permita mostrar todos los registros
      return [];
    }

    switch (normalizedStatus) {
      case 'processing':
      case 'en proceso':
        return ['processing', 'en proceso'];
      case 'pending balance':
      case 'pendiente saldo':
        return ['pending balance', 'pendiente saldo'];
      case 'cancelled':
      case 'cancelado':
        return ['cancelled', 'cancelado'];
      case 'shipped':
      case 'enviado':
        return ['shipped', 'enviado'];
      case 'completed':
      case 'finalizado':
        return ['completed', 'finalizado'];
      default:
        return [normalizedStatus];
    }
  }


  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing':
      case 'en proceso':
        return 'status-procesando';
      case 'pending balance':
      case 'pendiente saldo':
        return 'status-saldo';
      case 'cancelled':
      case 'cancelado':
        return 'status-cancelado';
      case 'shipped':
      case 'enviado':
        return 'status-enviado';
      case 'completed':
      case 'finalizado':
        return 'status-finalizado';
      default:
        return '';
    }
  }

  openEditOrderModal(order: Order) {
    const modalRef = this.modalService.open(OrderEditModalComponent, {
      size: 'lg',
      scrollable: true
    });
    modalRef.componentInstance.orderId = order.id; // Pasar el ID del pedido al modal

    modalRef.result.then((result) => {
      console.log(result);
      // Manejar resultado si es necesario
      this.loadOrders(); // Opcional: Recargar las órdenes para ver los cambios reflejados
    }, (reason) => {
      console.log('Modal dismissed: ', reason);
    });
  }

  translateStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'En proceso';
      case 'pending balance':
        return 'Pendiente Saldo';
      case 'cancelled':
        return 'Cancelado';
      case 'shipped':
        return 'Enviado';
      case 'completed':
        return 'Finalizado';
      default:
        return status; // En caso de no tener una traducción, retorna el estado original
    }
  }
}
