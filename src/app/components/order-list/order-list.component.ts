import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order';
import { ToastrService } from 'ngx-toastr';
import { Subscription, Subject } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderEditModalComponent } from '../../order-edit-modal/order-edit-modal.component';
import { PdfService } from '../../services/pdf.service';
import { debounceTime } from 'rxjs/operators';

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
  searchOrderId: string = '';
  searchClientId: string = '';
  searchTerm: string = '';

  private searchTermSubject: Subject<string> = new Subject();


  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private pdfService: PdfService
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

    this.searchTermSubject
      .pipe(debounceTime(3000))  // 3 segundos de debounce
      .subscribe(searchTerm => {
        this.filterOrdersByNameOrPhoneOrIdentification(searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.searchTermSubject.unsubscribe();
  }

  onSearchTermChanged(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
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

  companyData = {
    name: 'Twelve Shock',
    address: 'Cra 54a # 169-15',
    phone: '+57 3196253251',
    email: 'info@twelveshock.com',
    logoUrl: '../../../assets/marcadeagualetras2.png',
    socialMedia: {
      facebook: 'https://www.facebook.com/twelveshock12',
      web: 'http://www.twelveshock.com',
      instagram: 'https://www.instagram.com/twelveshock_oficial/'
    }
  };

  generatePDF(order: any) {
    const recipientData = {
      name: `${order.shipping.first_name} ${order.shipping.last_name}`,
      address: `${order.shipping.address_1}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.postcode}`,
      identification: order.shipping.identification,
      email: order.billing.email,
      phone: order.billing.phone
    };
    this.pdfService.generatePDF(this.companyData, recipientData);
  }

  searchOrderById(): void {
    const orderId = parseInt(this.searchOrderId, 10); // Convertir a número
    if (!isNaN(orderId)) {
      this.apiService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.filteredOrders = [order]; // Mostrar solo el pedido encontrado
          this.toastr.success('Pedido encontrado', 'Éxito');
        },
        error: (err) => {
          console.error('Error fetching order by ID:', err);
          this.toastr.error('Pedido no encontrado', 'Error');
        }
      });
    } else {
      this.toastr.warning('Por favor ingrese un ID válido', 'Advertencia');
    }
  }

  searchByClientId(): void {
    const clientId = Number(this.searchClientId.trim()); // Convertir a número
    if (!isNaN(clientId)) {
      // Filtrar órdenes por id_cliente
      this.filteredOrders = this.orders.filter(order =>
        order.billing && order.billing.id_cliente === clientId
      );

      console.log('Filtered Orders:', this.filteredOrders); // Para depurar

      if (this.filteredOrders.length > 0) {
        this.toastr.success('Órdenes filtradas correctamente', 'Éxito');
      } else {
        this.toastr.warning('No se encontraron órdenes para este ID de cliente', 'Advertencia');
      }
    } else {
      this.toastr.warning('Por favor ingrese un ID de cliente válido', 'Advertencia');
    }
  }

  filterOrdersByNameOrPhoneOrIdentification(searchTerm: string): void {
    const searchTermLower = searchTerm.trim().toLowerCase();

    this.filteredOrders = this.orders.filter(order => {
      const billingName = `${order.billing.first_name} ${order.billing.last_name}`.toLowerCase();
      const shippingName = `${order.shipping.first_name} ${order.shipping.last_name}`.toLowerCase();
      const phone = order.billing.phone ? order.billing.phone.toLowerCase() : '';
      const identification = order.shipping.identification ? order.shipping.identification.toLowerCase() : '';

      return billingName.includes(searchTermLower) ||
             shippingName.includes(searchTermLower) ||
             phone.includes(searchTermLower) ||
             identification.includes(searchTermLower);
    });

    if (this.filteredOrders.length > 0) {
      this.toastr.success('Órdenes filtradas correctamente', 'Éxito');
    } else {
      this.toastr.warning('No se encontraron órdenes para la búsqueda realizada', 'Advertencia');
    }
  }

  togglePaymentType(order: any) {
    if (order.shipping.paymentType === 'Contado') {
      order.shipping.paymentType = 'Contado';
    } else {
      order.shipping.paymentType = 'Contraentrega';
    }
    this.cdr.detectChanges();
  }

  copyShippingData(order: any): void {
    const paymentType = order.shipping.paymentType || 'Contado';
    const shippingFirstName = order.shipping.first_name || 'No especificado';
    const shippingLastName = order.shipping.last_name || 'No especificado';
    const billingIdentification = order.billing.identification || 'No especificado';
    const shippingAddress = order.shipping.address_1 || 'No especificado';
    const shippingAddress2 = order.shipping.address_2 || 'No especificado';
    const shippingCity = order.shipping.city || 'No especificado';
    const shippingState = order.shipping.state || 'No especificado';
    const shippingPhone = order.billing.phone ? `+${order.billing.phone}` : 'No especificado';

    // Texto que se copiará
    const shippingText = `
costo del envío "*${paymentType}*" por favor

*Remitente*

Jorge Andres Poveda Guerrero
3184228730

*Destinatario*

Nombre: ${shippingFirstName} ${shippingLastName}
Cédula: ${billingIdentification}
Teléfono: ${shippingPhone}
Dirección: ${shippingAddress} ${shippingAddress2}
Ciudad: ${shippingCity}
    `;

    navigator.clipboard.writeText(shippingText).then(() => {
      alert('Datos copiados al portapapeles');
    }).catch(err => {
      console.error('Error al copiar', err);
    });
  }


}
