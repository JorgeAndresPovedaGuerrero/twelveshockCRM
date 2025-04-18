import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Components
import { AppComponent } from './app.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { HeaderComponent } from './header/header.component';
import { OrderEditModalComponent } from './order-edit-modal/order-edit-modal.component';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { GastoFormComponent } from './gasto/gasto-form.component';
import { GastoListComponent } from './gasto/gasto-list.component';
import { ProveedorFormComponent } from './proveedor/proveedor-form.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { EstadisticasComponent } from './gasto/Estadisticas/estadisticas.component';
import { GastoChartComponent } from './gasto/gasto-chart/gasto-chart.component';
import { LoginComponent } from './components/login/login.component';
import { TareaListComponent } from './tarea-list/tarea-list.component';
import { TareaFormComponent } from './tarea-list/tarea-form.component';
import { ChecklistComponent } from './tarea-list/checklist.component';

// Services
import { ApiService } from './services/api.service';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrderFormComponent,
    OrderListComponent,
    HeaderComponent,
    OrderLogsComponent,
    GastoFormComponent,
    GastoListComponent,
    ProveedorFormComponent,
    ProveedorListComponent,
    OrderEditModalComponent,
    EstadisticasComponent,
    GastoChartComponent,
    TareaListComponent,
    TareaFormComponent,
    ChecklistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    NgbModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [
    ApiService,
    MessageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
