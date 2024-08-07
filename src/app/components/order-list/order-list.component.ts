import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  messageSubscription: Subscription | undefined;
  successMessage: string | null = null;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private messageService: MessageService
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
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.toastr.success('Órdenes cargadas correctamente', 'Éxito');
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.toastr.error('Error al cargar las órdenes', 'Error');
      }
    });
  }
}
