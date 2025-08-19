import { FrecuenciaRecordatorio } from '../../enums/frecuencia-recordatorio.enum';
import { EstadoRecordatorio } from '../../enums/estado-recordatorio.enum';
import { TipoRecordatorio } from '../../enums/tipo-recordatorio.enum';


export interface Recordatorio {
  id?: number;
  parejaId: number;
  creadoPorId: number;
  titulo: string;
  descripcion?: string;
  fechaHora: string; // ISO string para LocalDateTime
  tipo: TipoRecordatorio;
  esRecurrente?: boolean;
  frecuencia?: FrecuenciaRecordatorio;
  estado?: EstadoRecordatorio;
  minutosAntes?: number;
  lugarId?: number;
  creadoPorNombre?: string;
  lugarNombre?: string;
  tipoDescripcion?: string;
  estadoDescripcion?: string;
  frecuenciaDescripcion?: string;
}
