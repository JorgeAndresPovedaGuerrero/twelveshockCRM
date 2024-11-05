import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

@Component({
  selector: 'app-gasto-chart',
  templateUrl: './gasto-chart.component.html',
  styleUrls: ['./gasto-chart.component.scss']
})
export class GastoChartComponent implements OnInit {
  @Input() gastos: any[] = [];
  @Output() gastosFiltrados: EventEmitter<any[]> = new EventEmitter<any[]>(); // Emitimos los gastos filtrados
  chart: any;
  startDate: string = '';
  endDate: string = '';
  totalGastosFiltrados: number = 0;
  promedioGastosFiltrados: number = 0;

  ngOnInit() {
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  createChart() {
    const filteredGastos = this.filterGastosByDate();
    const labels = filteredGastos.map(gasto => new Date(gasto.fecha)).sort((a, b) => a.getTime() - b.getTime());
    const dataValues = filteredGastos.map(gasto => gasto.valor);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('gastoChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Gastos',
          data: dataValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'dd/MM/yyyy'
            },
            ticks: {
              source: 'data',
              autoSkip: true,
              maxRotation: 0
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Emitimos los gastos filtrados para que otros componentes puedan usarlos
    this.gastosFiltrados.emit(filteredGastos);
  }

  filterGastosByDate() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const filteredGastos = this.gastos.filter(gasto => {
      const fecha = new Date(gasto.fecha);
      return (!this.startDate || fecha >= start) && (!this.endDate || fecha <= end);
    });

    this.totalGastosFiltrados = filteredGastos.reduce((total, gasto) => total + gasto.valor, 0);

    const numDias = this.getDifferenceInDays(start, end);

    if (numDias > 0) {
      this.promedioGastosFiltrados = this.totalGastosFiltrados / numDias;
    } else {
      this.promedioGastosFiltrados = 0;
    }

    return filteredGastos;
  }

  getDifferenceInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor((endDate.getTime() - startDate.getTime()) / oneDay) + 1;
  }

  updateChart() {
    this.createChart();
  }
}
