import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Location } from '@angular/common';
import { LogProduct } from '../models/logProduct';

@Component({
  selector: 'app-order-logs',
  templateUrl: './order-logs.component.html',
  styleUrls: ['./order-logs.component.scss']
})
export class OrderLogsComponent implements OnInit {
  orderId!: number;
  logs: LogProduct[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadLogs();
    });
  }

  loadLogs() {
    this.loading = true;
    this.error = null;

    this.apiService.getOrderLogs(this.orderId).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
        console.log('Logs cargados:', logs);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error al cargar los logs:', error);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
