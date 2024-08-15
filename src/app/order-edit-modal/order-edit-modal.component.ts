import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-order-edit-modal',
  templateUrl: './order-edit-modal.component.html',
  styleUrls: ['./order-edit-modal.component.scss']
})
export class OrderEditModalComponent implements OnInit {
  @Input() orderId: number | undefined;
  editOrderForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.editOrderForm = this.fb.group({
      id: [0],
      status: [''],
      total: [''],
      date_created: [''],
      date_modified: [''],
      currency: [''],
      total_tax: [''],
      billing: this.fb.group({
        id_cliente:[0],
        first_name: [''],
        last_name: [''],
        identification: [''],
        address_1: [''],
        address_2: [''],
        city: [''],
        state: [''],
        postcode: [''],
        country: [''],
        email: [''],
        phone: ['']
      }),
      shipping: this.fb.group({
        first_name: [''],
        last_name: [''],
        identification: [''],
        address_1: [''],
        address_2: [''],
        city: [''],
        state: [''],
        postcode: [''],
        country: ['']
      }),
      line_items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.apiService.getOrderById(this.orderId).subscribe(
        (order) => {
          console.log(order);
          this.editOrderForm.patchValue({
            id: order.id,
            status: order.status,
            total: order.total,
            date_created: order.date_created,
            date_modified: order.date_modified,
            currency: order.currency,
            total_tax: order.total_tax
          });

          const billingGroup = this.editOrderForm.get('billing') as FormGroup;
          const shippingGroup = this.editOrderForm.get('shipping') as FormGroup;

          if (billingGroup && order.billing) {
            billingGroup.patchValue(order.billing);
          }

          if (shippingGroup && order.shipping) {
            shippingGroup.patchValue(order.shipping);
          }

          const lineItemsArray = this.editOrderForm.get('line_items') as FormArray;
          if (lineItemsArray && order.line_items) {
            order.line_items.forEach(item => {
              lineItemsArray.push(this.createLineItem(item));
            });
          }
        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  createLineItem(item?: any): FormGroup {
    return this.fb.group({
      name: [item?.name || ''],
      product_id: [item?.product_id || ''],
      quantity: [item?.quantity || ''],
      price: [item?.price || ''],
      total: [item?.total || '']
    });
  }

  saveChanges(): void {
    if (this.editOrderForm.valid) {
      const updatedOrder = { ...this.editOrderForm.value };

      if (this.orderId) {
        this.apiService.updateOrder(this.orderId, updatedOrder).subscribe(
          (response) => {
            console.log('Order updated successfully:', response);
            this.activeModal.close(response);
          },
          (error) => {
            console.error('Error updating order:', error);
          }
        );
      } else {
        console.error('Order ID is missing. Cannot update order.');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  deleteOrder(): void {
    if (this.orderId) {
      this.apiService.deleteOrder(this.orderId).subscribe(
        () => {
          console.log('Order deleted successfully');
          this.activeModal.close();
        },
        (error) => {
          console.error('Error deleting order:', error);
        }
      );
    } else {
      console.error('Order ID is missing. Cannot delete order.');
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Modal dismissed');
  }

  copyBillingInfo(event: any): void {
    const checked = event.target.checked;
    const billingGroup = this.editOrderForm.get('billing') as FormGroup;
    const shippingGroup = this.editOrderForm.get('shipping') as FormGroup;

    if (billingGroup && shippingGroup) {
      if (checked) {
        shippingGroup.patchValue(billingGroup.value);
      } else {
        shippingGroup.reset({
          first_name: '',
          last_name: '',
          identification: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          postcode: '',
          country: 'CO'
        });
      }
    }
  }

  get lineItems(): FormArray {
    return this.editOrderForm.get('line_items') as FormArray;
  }
}
