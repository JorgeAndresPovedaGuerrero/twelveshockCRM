// models/verificacionContraentrega.model.ts

export interface VerificacionContraentrega {
  id?: string;
  order_id?: string;
  ciudadEnvio?: string;
  id_cliente?: number;
  nombre_cliente?: string;
  estado: string;
  total?: number;
  saldo?: number;
  precio_envio?: number;
  fecha_creacion?: string;
  fecha_verificacion?: string;
  usuario_verificacion?: string;
  observaciones?: string;
}

// Interfaz para estadísticas de contraentrega
export interface EstadisticasContraentrega {
  totalPendientes: number;
  totalVerificados: number;
  totalCancelados: number;
  montoTotalPendiente: number;
  montoTotalVerificado: number;
  ciudadesConMayorVolumen: CiudadEstadistica[];
}

export interface CiudadEstadistica {
  ciudad: string;
  cantidad: number;
  montoTotal: number;
}

// Enum para estados
export enum EstadoContraentrega {
  PENDIENTE = 'PENDIENTE',
  VERIFICADO = 'VERIFICADO',
  CANCELADO = 'CANCELADO'
}

// Interfaz para filtros
export interface FiltrosContraentrega {
  estado?: EstadoContraentrega | 'TODOS';
  ciudad?: string;
  fechaInicio?: string;
  fechaFin?: string;
  cliente?: string;
}
