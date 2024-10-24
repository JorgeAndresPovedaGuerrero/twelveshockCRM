import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { GastoListComponent } from './gasto/gasto-list.component';
import { GastoFormComponent } from './gasto/gasto-form.component';

const routes: Routes = [
  { path: 'orders', component: OrderListComponent },
  { path: 'order-form', component: OrderFormComponent },
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'order-logs/:id', component: OrderLogsComponent },
  //Gastos
  { path: 'gastos', component: GastoListComponent },
  { path: 'gastos/nuevo', component: GastoFormComponent },
  { path: 'gastos/editar/:id', component: GastoFormComponent },
  //{ path: '**', redirectTo: '/orders' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
