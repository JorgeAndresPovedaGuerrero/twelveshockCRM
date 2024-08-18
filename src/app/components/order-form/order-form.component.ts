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
      balance: [''],
      date_balance: [''],
      down_payment: [''],
      means_of_payment_1: [''],
      means_of_payment_2: [''],
      billing: this.fb.group({
        id_cliente: [0],
        first_name: [''],
        last_name: [''],
        identification: [0],
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
        identification: [0],
        address_1: [''],
        address_2: [''],
        city: [''],
        state: [''],
        postcode: [''],
        country: ['CO'],
        price_shipping:[0]
      }),
      line_items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getNextOrderId();
  }

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

  translateStatus(status: string): string {
    const statusMap = new Map<string, string>([
      ['processing', 'En proceso'],
      ['cancelled', 'Cancelado'],
      ['completed', 'Finalizado'],
      ['pending', 'Pendiente saldo'],
      ['enviado', 'Enviado'],
      ['En proceso', 'En proceso'], // También soporta el texto en español directamente
      ['Cancelado', 'Cancelado'],
      ['Finalizado', 'Finalizado'],
      ['Pendiente saldo', 'Pendiente saldo'],
      ['Enviado', 'Enviado']
    ]);

    return statusMap.get(status) || status; // Devuelve el estado traducido o el original si no se encuentra
  }

  getNextOrderId(): void {
    this.apiService.getHighestOrderId().subscribe({
      next: (highestId: number) => {
        this.orderForm.patchValue({ id: highestId + 1 });
      },
      error: (error) => {
        console.error('Error fetching highest order ID:', error);
        this.toastr.error('No se pudo obtener el ID del pedido', 'Error');
      }
    });
  }
}
