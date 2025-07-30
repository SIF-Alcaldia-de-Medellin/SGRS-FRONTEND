export interface Request {
    id_solicitudes: number;
    Nombre?: string;
    Apellido?: string;
    Correo?: string;
    Telefono?: string;
    Secretaria?: string;
    Num_asistentes?: number;
    Fecha_reserva?: string;
    Hora_inicio?: string;
    Hora_final?: string;
    Estado?: number;
    Proposito?: string;
    Computador: boolean;
    HDMI: boolean;
}

export interface Intervalo{
    id: number;
    inicio: string;
    fin: string;
}

export interface Room {
    id_sala: number;
    intervalos: Array<Intervalo>;
    rangoHoras: number;
    estado: number;
    horaInicio?: string;
    horaFin?: string;
}