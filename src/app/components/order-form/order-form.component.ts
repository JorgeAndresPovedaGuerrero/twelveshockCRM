import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Order, Billing } from '../../models/order';
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
  proveedores: any[] = [];
  productos: any[] = [];

  paymentMethods: { value: string, display: string }[] = [];

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
        phone: [''],
        phone2: ['']
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
        price_shipping:[0],
        phone: ['']
      }),
      line_items: this.fb.array([])
    });
  }

ngOnInit(): void {
  this.getNextOrderId();
  this.onAbonoChange();
  this.loadClientId();
  this.cargarProveedores();
  this.cargarProductos();
  this.getPaymentMethods();

  this.orderForm.get('means_of_payment_2')?.valueChanges.subscribe((value) => {
    const shippingControl = this.orderForm.get('shipping.price_shipping');
    if (value === 'contraentrega' && shippingControl?.value <= 0) {
      this.toastr.warning('Debe ingresar un valor de envío para contraentrega', 'Advertencia');
    }
  });
}
  cargarProveedores(): void {
    this.apiService.obtenerProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  getPaymentMethods(): void {
  this.apiService.obtenerMediosPago().subscribe({
    next: (methods: any[]) => {
      this.paymentMethods = methods.map(method => ({
        value: method.nombre.toLowerCase(),
        display: method.nombre
      }));
    },
    error: err => {
      this.toastr.error('No se pudieron cargar los métodos de pago');
      console.error(err);
    }
  });
}

  cargarProductos(): void {
    this.apiService.obtenerProductos().subscribe((data) => {
      this.productos = data;
    });
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
      total: ['0', Validators.pattern('^[0-9]*$')],
      codigoProveedor: [''],
      imagen: [''],
      tieneImagen: [false]
    });
    this.lineItems.push(lineItemGroup);
  }

  onImageUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;

        // Actualizar el FormArray con la imagen
        this.lineItems.at(index).patchValue({
          imagen: base64Image,
          tieneImagen: true
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
  }

onSubmit(): void {
  const formValue = this.orderForm.value;

  const isContraentrega = formValue.means_of_payment_2 === 'contraentrega';
  const hasShippingCost = formValue.shipping?.price_shipping > 0;

  if (isContraentrega && !hasShippingCost) {
    this.toastr.error('Debe ingresar un valor de envío para contraentrega', 'Error');
    return;
  }

  if (this.orderForm.valid) {
    const orderData: Order = this.orderForm.value;

    // Si es contraentrega, primero creamos la verificación enviando la orden completa
    if (isContraentrega) {
      this.apiService.crearContraentrega(orderData).subscribe({
        next: () => {
          this.toastr.success('Verificación de contraentrega creada correctamente', 'Éxito');
          this.crearPedido(orderData); // crea el pedido después de contraentrega
        },
        error: (error) => {
          this.toastr.error('Error creando la contraentrega', 'Error');
          console.error('Error creando contraentrega:', error);
        }
      });
    } else {
      this.crearPedido(orderData); // pedido sin contraentrega
    }
  } else {
    this.toastr.error('Formulario inválido', 'Error');
    this.markFormGroupTouched(this.orderForm);
  }
}

markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();

    if ((control as FormGroup).controls) {
      this.markFormGroupTouched(control as FormGroup);
    }
  });
}

private crearPedido(orderData: Order): void {
  this.apiService.createOrder(orderData).subscribe({
    next: (data) => {
      this.toastr.success('El pedido fue creado correctamente', 'Éxito');
      console.log('Order created:', data);
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    },
    error: (error) => {
      this.toastr.error('Error creando el pedido', 'Error');
      console.error('Error creating order:', error);
    }
  });
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
    this.apiService.getHighestOrderId(true).subscribe({
      next: (orderId) => {
          console.log(orderId); // Verifica que el valor se muestra en la consola

          // Asignamos el valor al campo correspondiente en el formulario
          this.orderForm.patchValue({
              id: orderId
          });
      },
      error: (error) => {
          console.error('Error fetching highest order ID', error);
      }
  });
  }

  loadClientId(): void {
    this.apiService.getClientId().subscribe({
      next: (id_cliente: number) => {
        this.orderForm.get('billing')?.patchValue({ id_cliente: id_cliente + 1 });
      },
      error: (error) => {
        console.error('Error fetching client ID:', error);
        this.toastr.error('No se pudo obtener el ID del cliente', 'Error');
      }
    });
  }

  onAbonoChange(): void {
    this.orderForm.get('down_payment')?.valueChanges.subscribe(value => {
      const total = this.orderForm.get('total')?.value || 0;
      const balance = total - value;
      this.orderForm.get('balance')?.setValue(balance >= 0 ? balance : 0);
    });
  }


  loadBilling(): void {
    const id_cliente = this.orderForm.get('billing.id_cliente')?.value;

    if (id_cliente) {
      this.apiService.getBillingData(id_cliente).subscribe({
        next: (billing: Billing) => {
          if (billing) {
            this.orderForm.get('billing')?.patchValue(billing);
            this.toastr.success('La información de facturación se cargó correctamente.', 'Éxito');
          } else {
            this.toastr.warning('Cliente no encontrado.', 'Advertencia');
          }
        },
        error: (error) => {
          console.error('Error fetching billing info:', error);
          this.toastr.error('No se pudo obtener la información de facturación', 'Error');
        }
      });
    } else {
      this.toastr.warning('El ID del cliente no está definido', 'Advertencia');
    }
  }

}
