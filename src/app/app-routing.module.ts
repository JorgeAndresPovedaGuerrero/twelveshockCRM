import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { GastoListComponent } from './gasto/gasto-list.component';
import { GastoFormComponent } from './gasto/gasto-form.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { ProveedorFormComponent } from './proveedor/proveedor-form.component';
import { ProductoFormComponent } from './productos/producto-form.component';
import { ProductoListComponent } from './productos/producto-list.component';
import { MedioPagoFormComponent } from './medios-de-pago/medio-pago-form.component';
import { MedioPagoListComponent } from './medios-de-pago/medio-pago-list.component';
import { ContraentregaListComponent } from './contraentrega/contraentrega-list.component';
import { EstadisticasComponent } from './gasto/Estadisticas/estadisticas.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { TareaListComponent } from './tarea-list/tarea-list.component';
import { TareaFormComponent } from './tarea-list/tarea-form.component';
import { ChecklistComponent } from './tarea-list/checklist.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-form',
    component: OrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-logs/:id',
    component: OrderLogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos',
    component: GastoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos/nuevo',
    component: GastoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos/editar/:id',
    component: GastoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedor',
    component: ProveedorListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedor/nuevo',
    component: ProveedorFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proveedor/editar/:id',
    component: ProveedorFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    component: ProductoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productos/nuevo',
    component: ProductoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productos/editar/:id',
    component: ProductoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos/estadisticas',
    component: EstadisticasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contraentrega',
    component: ContraentregaListComponent,
    canActivate: [AuthGuard]
  },
  {
  path: 'inicio',
  component: BienvenidaComponent,
  canActivate: [AuthGuard]
  },
  { path: 'medios-pago', component: MedioPagoListComponent, canActivate: [AuthGuard] },
  { path: 'medios-pago/nuevo', component: MedioPagoFormComponent, canActivate: [AuthGuard] },
  { path: 'medios-pago/editar/:id', component: MedioPagoFormComponent, canActivate: [AuthGuard] },
     // Nuevas rutas para el checklist
  { path: 'checklist', component: ChecklistComponent, canActivate: [AuthGuard] },
  { path: 'checklist/tareas', component: TareaListComponent, canActivate: [AuthGuard] },
  { path: 'checklist/tareas/nuevo', component: TareaFormComponent, canActivate: [AuthGuard] },
  { path: 'checklist/tareas/editar/:id', component: TareaFormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
