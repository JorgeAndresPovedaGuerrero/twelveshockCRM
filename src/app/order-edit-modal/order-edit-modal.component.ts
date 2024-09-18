import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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

  paymentMethods = [
    { value: 'bancolombia', display: 'Bancolombia' },
    { value: 'nequi', display: 'Nequi' },
    { value: 'daviplata', display: 'Daviplata' },
    { value: 'pagina_web', display: 'Página Web' },
    { value: 'wompi', display: 'Wompi' },
    { value: 'payu', display: 'Payu' },
    { value: 'efectivo', display: 'Efectivo' },
    { value: 'efecty', display: 'Efecty' },
    { value: 'paga_todo', display: 'Paga Todo' },
    { value: 'gana', display: 'Gana' },
    { value: 'otro', display: 'Otro' }
  ];

  statusOptions = [
    { value: 'processing', display: 'En proceso' },
    { value: 'cancelled', display: 'Cancelado' },
    { value: 'completed', display: 'Finalizado' },
    { value: 'pending', display: 'Pendiente saldo' },
    { value: 'enviado', display: 'Enviado' }
  ];

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
      balance: [''],
      date_balance: [''],
      down_payment: [''],
      means_of_payment_1: [''],
      means_of_payment_2: [''],
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
        phone: [''],
        phone2: ['']
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
        country: [''],
        price_shipping:[0]
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
            total_tax: order.total_tax,
            balance: order.balance,
            date_balance: order.date_balance,
            down_payment: order.down_payment,
            means_of_payment_1: order.means_of_payment_1,
            means_of_payment_2: order.means_of_payment_2
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
          lineItemsArray.clear();
          if (lineItemsArray && order.line_items) {
            order.line_items.forEach(item => {
              lineItemsArray.push(this.createLineItem(item));
            });
          }
          this.lineItems.valueChanges.subscribe(() => this.updateOrderTotal());
          this.editOrderForm.get('total')?.valueChanges.subscribe(() => this.updateBalance());
          this.editOrderForm.get('down_payment')?.valueChanges.subscribe(() => this.updateBalance());

        },
        (error) => {
          console.error('Error fetching order:', error);
        }
      );
    }
  }

  updateBalance() {
    const total = this.editOrderForm.get('total')?.value || 0;
    const downPayment = this.editOrderForm.get('down_payment')?.value || 0;
    const balance = total - downPayment;
    this.editOrderForm.get('balance')?.setValue(balance, { emitEvent: false });
  }

  createLineItem(item?: any): FormGroup {
    return this.fb.group({
      name: [item?.name || ''],
      product_id: [item?.product_id || ''],
      quantity: [item?.quantity || ''],
      subtotal: [item?.subtotal || ''],
      total: [item?.total || '']
    });
  }

  updateOrderTotal(): void {
    const lineItemsArray = this.editOrderForm.get('line_items') as FormArray;
    let total = 0;
    lineItemsArray.controls.forEach(control => {
      const itemTotal = control.get('total')?.value;
      if (itemTotal) {
        total += parseFloat(itemTotal);
      }
    });

    // Update the order total
    this.editOrderForm.patchValue({ total });
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
          country: 'CO',
          price_shipping: 0
        });
      }
    }
  }

  get lineItems(): FormArray {
    return this.editOrderForm.get('line_items') as FormArray;
  }

  addLineItem(): void {
    const lineItemGroup = this.fb.group({
      id: [0],
      name: [''],
      product_id: [0],
      quantity: [0, Validators.min(1)],
      subtotal: ['0', Validators.pattern('^[0-9]*$')],
      total: ['0', Validators.pattern('^[0-9]*$')]
    });
    this.lineItems.push(lineItemGroup);
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }
}
