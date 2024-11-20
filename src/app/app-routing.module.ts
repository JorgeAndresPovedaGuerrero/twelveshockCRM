import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { GastoListComponent } from './gasto/gasto-list.component';
import { GastoFormComponent } from './gasto/gasto-form.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { ProveedorFormComponent } from './proveedor/proveedor-form.component';
import { EstadisticasComponent } from './gasto/Estadisticas/estadisticas.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

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
    path: 'gastos/estadisticas',
    component: EstadisticasComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
