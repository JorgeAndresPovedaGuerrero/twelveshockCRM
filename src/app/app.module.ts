import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importa este módulo
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ApiService } from './services/api.service';
import { MessageService } from './services/message.service'; // <--- Asegúrate de importar el servicio
import { HeaderComponent } from './header/header.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { OrderEditModalComponent } from './order-edit-modal/order-edit-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { OrderLogsComponent } from './order-logs/order-logs.component';
import { RouterModule } from '@angular/router';
import { GastoFormComponent } from './gasto/gasto-form.component';
import { GastoListComponent } from './gasto/gasto-list.component';
import { ProveedorFormComponent } from './proveedor/proveedor-form.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { EstadisticasComponent } from './gasto/Estadisticas/estadisticas.component';
import { GastoChartComponent  } from './gasto/gasto-chart/gasto-chart.component';


@NgModule({ declarations: [
        AppComponent,
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
    ], // <--- Asegúrate de incluirlo en los providers
    bootstrap: [AppComponent], imports: [NgbModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        FormsModule,
        BrowserAnimationsModule, // Agrega este módulo
        TooltipModule.forRoot(),
        ToastrModule.forRoot()], providers: [ApiService, MessageService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
