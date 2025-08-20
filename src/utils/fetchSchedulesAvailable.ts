import { API_URL } from "../config/consts";
import { Request } from "../types";

export const fetchSchedulesAvailable = async (request: Request) => {
    if (!request || !request.id_solicitudes) {
        throw new Error('No se encontró solicitud o id_solicitudes no está definido.');
    }

    const idRequest = request.id_solicitudes;
    let response: Response;
    const assistansCount = request?.Num_asistentes || 0;

    if (assistansCount <= 15) {
        response = await fetch(`${API_URL}/salas/intervalos-individual/${idRequest}`);
    } else {
        response = await fetch(`${API_URL}/salas/intervalos-combinados/${idRequest}`);
    }

    if (!response.ok) {
        throw new Error('Error al obtener los intervalos');
    }

    const responseData = await response.json();
    const schedules = (responseData?.data?.data ?? responseData?.data) ?? [];
    return schedules;
};