import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Gasto } from '../../models/gasto';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  gastos: Gasto[] = [];
  gastosFiltrados: Gasto[] = []; // Nueva lista de gastos filtrados
  totalGastos: number = 0;
  totalGastosFiltrados: number = 0;
  totalGastosAnuales: number = 0;
  promedioGastos: number = 0;
  gastosMensuales: number = 0;
  gastosPorMes: any[] = [];
  mesSeleccionado: number = new Date().getMonth() + 1; // Mes seleccionado (1 = Enero, 12 = Diciembre)
  anioSeleccionado: number = new Date().getFullYear(); // Año seleccionado

  startDate: string = ''; // Fecha de inicio para el filtro
  endDate: string = '';   // Fecha de fin para el filtro

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.obtenerGastos().subscribe(
      (data: Gasto[]) => {
        this.gastos = data;
        // Ordenamos los gastos por fecha de manera ascendente
        this.gastos.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        this.calcularEstadisticas();
        // Ordenamos los gastosFiltrados por fecha de manera ascendente
        this.gastosFiltrados = this.gastos.slice();
        this.gastosFiltrados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      },
      error => {
        console.error('Error al obtener los gastos:', error);
      }
    );
  }

  actualizarGastosFiltrados(filtrados: Gasto[]) {
    this.gastosFiltrados = filtrados; // Actualizar la tabla con los gastos filtrados
  }

  calcularEstadisticas() {
    // Calcular el gasto total del último año
    const fechaInicio = new Date(this.anioSeleccionado, 0, 1); // 1 de enero del año pasado
    const fechaFin = new Date(this.anioSeleccionado +1, 0, 1); // 1 de enero del año actual
    this.totalGastosAnuales = this.gastos.reduce((acc, gasto) => {
      const fecha = new Date(gasto.fecha);
      // Verificar si la fecha del gasto está en el último año
      return acc + (fecha >= fechaInicio && fecha < fechaFin ? (gasto.valor ?? 0) : 0);
    }, 0);

    // Filtrar los gastos para el mes y año seleccionados
    const gastosFiltrados = this.gastos.filter(gasto => {
      const fecha = new Date(gasto.fecha);
      return fecha.getMonth() + 1 === this.mesSeleccionado && fecha.getFullYear() === this.anioSeleccionado;
    });

    // Calcular el gasto total para el mes seleccionado
    const totalGastosMes = gastosFiltrados.reduce((acc, gasto) => acc + (gasto.valor ?? 0), 0);

    // Obtener el número de días del mes seleccionado
    const diasEnElMes = new Date(this.anioSeleccionado, this.mesSeleccionado, 0).getDate();

    // Calcular el gasto promedio por día (total del mes / días en el mes)
    this.promedioGastos = diasEnElMes > 0 ? totalGastosMes / diasEnElMes : 0;

    // Inicializar un objeto para acumular los gastos por mes y año
    const gastosPorMesAnio: { [key: string]: number } = {};

    // Recorrer todos los gastos y agruparlos por mes y año
    this.gastos.forEach(gasto => {
      const fecha = new Date(gasto.fecha);
      const mesAnio = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`; // Formato Año-Mes

      if (!gastosPorMesAnio[mesAnio]) {
        gastosPorMesAnio[mesAnio] = 0;
      }

      gastosPorMesAnio[mesAnio] += gasto.valor ?? 0;
    });

    // Convertir los valores del objeto en un array de los totales por mes
    this.gastosPorMes = Object.values(gastosPorMesAnio);

    // Calcular los gastos mensuales (sumar todos los meses y dividir por la cantidad de meses con gastos)
    const totalMesesConGastos = this.gastosPorMes.length;
    this.gastosMensuales = totalMesesConGastos > 0
      ? this.gastosPorMes.reduce((acc, total) => acc + total, 0) / totalMesesConGastos
      : 0;
  }

    // Método para filtrar los gastos por fecha
    filtrarGastos() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      // Filtrar los gastos según las fechas seleccionadas
      this.gastosFiltrados = this.gastos.filter(gasto => {
        const fecha = new Date(gasto.fecha);
        return (!this.startDate || fecha >= start) && (!this.endDate || fecha <= end);
      });

      // Calcular el total de gastos filtrados
      this.totalGastosFiltrados = this.gastosFiltrados.reduce((acc, gasto) => acc + (gasto.valor ?? 0), 0);
    }

      // Método para actualizar los filtros y la gráfica cuando cambia la fecha
  updateFilters() {
    this.filtrarGastos(); // Filtrar los gastos para la tabla y los cálculos
    // También puedes actualizar cualquier otra estadística relacionada si lo deseas
  }

  // Método para cambiar el mes seleccionado (puedes llamarlo desde el template)
  cambiarMesSeleccionado(mes: number, anio: number) {
    this.mesSeleccionado = mes;
    this.anioSeleccionado = anio;
    this.calcularEstadisticas(); // Recalcular estadísticas cuando se cambia el mes
  }
}
