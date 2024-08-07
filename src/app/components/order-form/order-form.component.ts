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
  orderForm: FormGroup = this.fb.group({
    id: [0, Validators.required],
    date_created: ['', Validators.required],
    date_modified: ['', Validators.required],
    total: ['0', Validators.required],
    status: ['processing', Validators.required],
    currency: ['COP', Validators.required],
    total_tax: ['0', Validators.required],
    billing: this.fb.group({
      first_name: [''],
      last_name: [''],
      address_1: [''],
      address_2: [''],
      city: [''],
      state: [''],
      postcode: [''],
      country: ['CO'],
      email: [''],
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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  get lineItems(): FormArray {
    return this.orderForm.get('line_items') as FormArray;
  }

  addLineItem(): void {
    const lineItemGroup = this.fb.group({
      id: [0],
      name: [''],
      product_id: [0],
      quantity: [0],
      subtotal: ['0'],
      total: ['0']
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
      console.error('Form is invalid');
    }
  }
}
