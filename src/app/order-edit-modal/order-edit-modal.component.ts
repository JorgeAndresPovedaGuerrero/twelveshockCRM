import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/api.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order-edit-modal',
  templateUrl: './order-edit-modal.component.html',
  styleUrls: ['./order-edit-modal.component.scss']
})
export class OrderEditModalComponent implements OnInit {
  @Input() order: Order | undefined;
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public activeModal: NgbActiveModal
  ) {
    this.orderForm = this.fb.group({
      id: [''],
      status: [''],
      total: ['']
      // Agrega más controles según sea necesario
    });
  }

  ngOnInit(): void {
    if (this.order) {
      this.orderForm.patchValue(this.order);
    }
  }

  saveOrder(): void {
    if (this.order) {
      const updatedOrder = { ...this.order, ...this.orderForm.value };
      this.apiService.createOrder(updatedOrder).subscribe({
        next: (order) => {
          this.activeModal.close('Order updated successfully');
        },
        error: (err) => {
          console.error('Error updating order:', err);
        }
      });
    }
  }
}
