import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';

const routes: Routes = [
  { path: 'orders', component: OrderListComponent },
  { path: 'order-form', component: OrderFormComponent },
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'order-logs/:id', component: OrderLogsComponent },
  //{ path: '**', redirectTo: '/orders' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
