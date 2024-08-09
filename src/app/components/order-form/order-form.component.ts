import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Order } from '../../models/order';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.orderForm = this.fb.group({
      id: [0],
      date_created: [''],
      date_modified: [''],
      total: ['0', Validators.pattern('^[0-9]*$')],
      status: ['processing'],
      currency: ['COP'],
      total_tax: ['0', Validators.pattern('^[0-9]*$')],
      billing: this.fb.group({
        first_name: [''],
        last_name: [''],
        address_1: [''],
        address_2: [''],
        city: [''],
        state: [''],
        postcode: [''],
        country: ['CO'],
        email: ['', Validators.email],
        phone: ['']
      }),
      shipping: this.fb.group({
        first_name: [''],
        last_name: [''],
        address_1: [''],
        address_2: [''],
        city: [''],
        state: [''],
        postcode: [''],
        country: ['CO']
      }),
      line_items: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  get lineItems(): FormArray {
    return this.orderForm.get('line_items') as FormArray;
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

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderData: Order = this.orderForm.value;
      this.apiService.createOrder(orderData).subscribe({
        next: (data) => {
          this.toastr.success('El pedido fue creado correctamente', 'Éxito');
          console.log('Order created:', data);
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 2000); // Espera 2 segundos antes de navegar
        },
        error: (error) => {
          this.toastr.error('Error creando el pedido', 'Error');
          console.error('Error creating order:', error);
        }
      });
    } else {
      this.toastr.error('Formulario inválido', 'Error');
      this.markAllAsTouched();
      this.logValidationErrors();
      console.error('Form is invalid', this.orderForm);
    }
  }

  markAllAsTouched(): void {
    this.orderForm.markAllAsTouched();
    this.lineItems.controls.forEach(control => control.markAsTouched());
  }

  logValidationErrors(group: FormGroup = this.orderForm): void {
    Object.keys(group.controls).forEach(key => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl); // Llamar recursivamente si es un FormGroup anidado
      } else if (abstractControl instanceof FormArray) {
        abstractControl.controls.forEach((control, index) => {
          this.logValidationErrors(control as FormGroup); // Llamar recursivamente si es un FormArray
        });
      } else {
        if (abstractControl && abstractControl.invalid) {
          console.error(`Control: ${key}, Errors:`, abstractControl.errors);
        }
      }
    });
  }

  copyBillingInfo(event: any): void {
    const checked = event.target.checked;
    const billingGroup = this.orderForm.get('billing') as FormGroup;
    const shippingGroup = this.orderForm.get('shipping') as FormGroup;

    if (billingGroup && shippingGroup) {
      if (checked) {
        shippingGroup.patchValue(billingGroup.value);
      } else {
        shippingGroup.reset({
          first_name: '',
          last_name: '',
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
}
