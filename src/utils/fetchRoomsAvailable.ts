import { API_URL } from "../config/consts";
import { Request } from "../types";

export const fetchRoomsAvailable = async (request: Request) => {
    if (!request || !request.id_solicitudes) {
        throw new Error('No se encontró solicitud o id_solicitudes no está definido.');
    }

    const idRequest = request.id_solicitudes;
    let response: Response;
    const assistansCount = request?.Num_asistentes || 0;

    if (assistansCount <= 15) {
        response = await fetch(`${API_URL}/salas/disponibilidad-individual/${idRequest}`);
        if (!response.ok) {
            throw new Error('Error al obtener las salas individuales');
        }
    } else {
        response = await fetch(`${API_URL}/salas/disponibilidad-combinada/${idRequest}`);
        if (!response.ok) {
            throw new Error('Error al obtener las salas combinadas');
        }
    }
    const responseData = await response.json();
    const rooms = responseData.data;

    return rooms;
};