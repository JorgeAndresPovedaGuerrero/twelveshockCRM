export interface Tarea {
  id?: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
}

export interface ProgresoTarea {
  id?: string;
  fecha: string;
  tareas: { [key: string]: number }; // Map de idTarea -> estado (0, 1, 2)
}

export interface ResumenProgreso {
  totalTareas: number;
  tareasCompletadas: number;
  porcentajeCompletado: number;
}

export interface TareaConEstado extends Tarea {
  estado: number; // 0 = no completada, 1 = completada, 2 = no aplica
}
