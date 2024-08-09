import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    AppComponent,
    OrderFormComponent,
    OrderListComponent,
    HeaderComponent,
    OrderEditModalComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Agrega este módulo
    TooltipModule.forRoot(),
    NgbModule,
    ToastrModule.forRoot()
  ],
  providers: [ApiService, MessageService], // <--- Asegúrate de incluirlo en los providers
  bootstrap: [AppComponent]
})
export class AppModule { }
